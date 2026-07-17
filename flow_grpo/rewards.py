"""World-R1 reward definitions.

Source note:
- The rollout/reward wiring is adapted from Flow-GRPO style online training.
- The released reward path follows the World-R1 paper:
  `R = R_3D + R_gen`, where `R_3D = S_meta + S_recon + S_traj`.
"""

import os
from io import BytesIO

import numpy as np
import requests
import torch
from PIL import Image
from requests.adapters import HTTPAdapter, Retry

from reward_server.protocol import encode_general_request, encode_reward_3d_request

REWARD_3D = "reward_3d"
REWARD_GENERAL = "reward_general"
REWARD_TOTAL = "reward_total"
SCORE_META_VIEW = "score_meta_view"
SCORE_RECONSTRUCTION = "score_reconstruction"
SCORE_TRAJECTORY_ALIGNMENT = "score_trajectory_alignment"
TRAJECTORY_COMPARISON_PATHS = "trajectory_comparison_paths"


def _resolve_remote_url(
    url_env: str,
    host_env: str,
    port_env: str,
    default_path: str,
    default_port: int,
) -> str:
    explicit_url = os.getenv(url_env)
    if explicit_url:
        return explicit_url.rstrip("/")

    explicit_host = os.getenv(host_env)
    explicit_port = os.getenv(port_env)
    if explicit_host or explicit_port:
        host = explicit_host or "127.0.0.1"
        port = int(explicit_port or default_port)
        return f"http://{host}:{port}"

    host = os.getenv("REWARD_SERVER_HOST", "127.0.0.1")
    port = int(os.getenv("REWARD_SERVER_PORT", str(default_port)))
    return f"http://{host}:{port}{default_path}"


def remote_reward_3d(device):
    del device

    batch_size = 8
    url = _resolve_remote_url(
        url_env="REWARD_3D_SERVER_URL",
        host_env="REWARD_3D_HOST",
        port_env="REWARD_3D_PORT",
        default_path="/",
        default_port=8089,
    )
    sess = requests.Session()
    sess.trust_env = False
    retries = Retry(total=1000, backoff_factor=1, status_forcelist=[500], allowed_methods=False)
    sess.mount("http://", HTTPAdapter(max_retries=retries))

    def _fn(images, prompts, metadata):
        if isinstance(images, torch.Tensor):
            images = images.cpu()

        if images.dim() == 4:
            images = images.unsqueeze(1)

        batch_videos = []
        for b in range(images.shape[0]):
            video = images[b]
            video_frames = []
            for frame_idx in range(video.shape[0]):
                frame = video[frame_idx]
                if frame.dtype.is_floating_point:
                    frame = (frame.clamp(0, 1) * 255.0).to(torch.uint8)
                frame_np = frame.permute(1, 2, 0).numpy()
                img = Image.fromarray(frame_np)
                buffer = BytesIO()
                img.save(buffer, format="JPEG")
                video_frames.append(buffer.getvalue())
            batch_videos.append(video_frames)

        num_items = len(prompts) if prompts is not None else images.shape[0]
        if isinstance(metadata, list):
            camera_trajectories = [
                item.get("camera_trajectory") if isinstance(item, dict) else None
                for item in metadata
            ]
        elif isinstance(metadata, dict):
            camera_trajectories = [metadata.get("camera_trajectory")] * num_items
        else:
            camera_trajectories = [None] * num_items

        if len(camera_trajectories) != num_items:
            if len(camera_trajectories) < num_items:
                camera_trajectories.extend([None] * (num_items - len(camera_trajectories)))
            else:
                camera_trajectories = camera_trajectories[:num_items]

        videos_batched = [batch_videos[i:i + batch_size] for i in range(0, len(batch_videos), batch_size)]
        prompts_batched = [prompts[i:i + batch_size] for i in range(0, len(prompts), batch_size)]
        camera_trajectories_batched = [
            camera_trajectories[i:i + batch_size] for i in range(0, len(camera_trajectories), batch_size)
        ]

        all_scores = []
        all_reconstruction_scores = []
        all_meta_view_scores = []
        all_trajectory_alignment_scores = []
        all_trajectory_comparison_paths = []
        for video_batch, prompt_batch, trajectory_batch in zip(
            videos_batched, prompts_batched, camera_trajectories_batched
        ):
            payload = encode_reward_3d_request(
                video_batch,
                prompt_batch,
                trajectory_batch,
            )
            response = sess.post(url, json=payload, timeout=2000)
            response.raise_for_status()
            response_data = response.json()
            all_scores += response_data["outputs"]
            if response_data.get("details"):
                all_reconstruction_scores += [float(item["gs_score"]) for item in response_data["details"]]
                all_meta_view_scores += [float(item["meta_score"]) for item in response_data["details"]]
                all_trajectory_alignment_scores += [float(item["camera_motion_score"]) for item in response_data["details"]]
                all_trajectory_comparison_paths += [
                    item.get("trajectory_comparison_path", "")
                    for item in response_data["details"]
                ]

        metadata = {}
        if all_reconstruction_scores:
            metadata[SCORE_RECONSTRUCTION] = all_reconstruction_scores
        if all_meta_view_scores:
            metadata[SCORE_META_VIEW] = all_meta_view_scores
        if all_trajectory_alignment_scores:
            metadata[SCORE_TRAJECTORY_ALIGNMENT] = all_trajectory_alignment_scores
        if all_trajectory_comparison_paths:
            metadata[TRAJECTORY_COMPARISON_PATHS] = all_trajectory_comparison_paths

        return all_scores, metadata

    return _fn


def remote_reward_general(device):
    del device

    import random

    batch_size = 64
    url = _resolve_remote_url(
        url_env="GENERAL_REWARD_SERVER_URL",
        host_env="GENERAL_REWARD_HOST",
        port_env="GENERAL_REWARD_PORT",
        default_path="/",
        default_port=8090,
    )
    sess = requests.Session()
    sess.trust_env = False
    retries = Retry(total=1000, backoff_factor=1, status_forcelist=[500], allowed_methods=False)
    sess.mount("http://", HTTPAdapter(max_retries=retries))

    def _fn(images, prompts, metadata):
        del metadata

        if isinstance(images, torch.Tensor):
            if images.dim() == 5:
                _, num_frames = images.shape[:2]
                selected_timestep = random.randint(0, num_frames - 1)
                if images.shape[2] == 3:
                    images = images[:, selected_timestep].permute(0, 2, 3, 1)
                else:
                    images = images[:, selected_timestep]

            images = (images * 255).round().clamp(0, 255).to(torch.uint8).cpu().numpy()
            if images.shape[-1] != 3:
                images = images.transpose(0, 2, 3, 1)

        batch_images = []
        for image_array in images:
            image = Image.fromarray(image_array)
            buffer = BytesIO()
            image.save(buffer, format="JPEG")
            batch_images.append(buffer.getvalue())

        images_batched = [batch_images[i:i + batch_size] for i in range(0, len(batch_images), batch_size)]
        prompts_batched = [prompts[i:i + batch_size] for i in range(0, len(prompts), batch_size)]

        all_scores = []
        for image_batch, prompt_batch in zip(images_batched, prompts_batched):
            payload = encode_general_request(image_batch, prompt_batch)
            response = sess.post(url, json=payload, timeout=1000)
            response.raise_for_status()
            response_data = response.json()
            all_scores += response_data["outputs"]

        return all_scores, {}

    return _fn


def multi_score(device, score_dict):
    reward_functions = {
        REWARD_3D: remote_reward_3d,
        REWARD_GENERAL: remote_reward_general,
    }
    unknown_rewards = set(score_dict.keys()) - set(reward_functions.keys())
    if unknown_rewards:
        raise ValueError(
            f"Unknown reward keys: {sorted(unknown_rewards)}. "
            f"Supported keys: {sorted(reward_functions.keys())}."
        )
    reward_fns = {reward_name: reward_functions[reward_name](device) for reward_name in score_dict}

    skip_3d_rewards = {REWARD_3D}

    def _fn(images, prompts, metadata, ref_images=None, only_strict=True):
        del ref_images, only_strict

        num_items = len(prompts) if prompts is not None else len(images)
        total_scores = np.zeros(num_items, dtype=np.float32)
        results = {}
        merged_metadata = {}

        is_any_dynamic = False
        if isinstance(metadata, list) and metadata:
            is_any_dynamic = any(item.get("is_dynamic", False) for item in metadata if isinstance(item, dict))

        for reward_name, weight in score_dict.items():
            if is_any_dynamic and reward_name in skip_3d_rewards:
                continue

            reward_scores, reward_metadata = reward_fns[reward_name](images, prompts, metadata)
            reward_scores = np.asarray(reward_scores, dtype=np.float32)
            total_scores += float(weight) * reward_scores
            results[reward_name] = reward_scores.tolist()
            if reward_metadata:
                merged_metadata.update(reward_metadata)

        if SCORE_RECONSTRUCTION in merged_metadata:
            results[SCORE_RECONSTRUCTION] = merged_metadata[SCORE_RECONSTRUCTION]
        if SCORE_META_VIEW in merged_metadata:
            results[SCORE_META_VIEW] = merged_metadata[SCORE_META_VIEW]
        if SCORE_TRAJECTORY_ALIGNMENT in merged_metadata:
            results[SCORE_TRAJECTORY_ALIGNMENT] = merged_metadata[SCORE_TRAJECTORY_ALIGNMENT]
        results[REWARD_TOTAL] = total_scores.tolist()
        return results, merged_metadata

    return _fn
