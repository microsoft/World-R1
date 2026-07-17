"""JSON protocol helpers shared by reward clients and servers."""

import base64
import binascii
from typing import Any


def _require_list(value: Any, field: str) -> list:
    if not isinstance(value, list):
        raise ValueError(f"'{field}' must be a list")
    return value


def _encode_bytes(value: Any, field: str) -> str:
    if not isinstance(value, (bytes, bytearray, memoryview)):
        raise ValueError(f"'{field}' entries must be bytes")
    return base64.b64encode(bytes(value)).decode("ascii")


def _decode_bytes(value: Any, field: str) -> bytes:
    if not isinstance(value, str):
        raise ValueError(f"'{field}' entries must be base64 strings")
    try:
        return base64.b64decode(value, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError(f"'{field}' contains invalid base64 data") from exc


def _validate_prompts(prompts: Any, batch_size: int) -> list[str]:
    prompts = _require_list(prompts, "prompts")
    if len(prompts) != batch_size:
        raise ValueError("media and prompt batch sizes must match")
    if not all(isinstance(prompt, str) for prompt in prompts):
        raise ValueError("'prompts' entries must be strings")
    return prompts


def _to_json_compatible(value: Any) -> Any:
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    if isinstance(value, dict):
        if not all(isinstance(key, str) for key in value):
            raise ValueError("camera trajectory keys must be strings")
        return {key: _to_json_compatible(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_to_json_compatible(item) for item in value]
    if hasattr(value, "tolist"):
        return _to_json_compatible(value.tolist())
    if hasattr(value, "item"):
        return _to_json_compatible(value.item())
    raise ValueError(f"camera trajectory value is not JSON serializable: {type(value).__name__}")


def encode_general_request(images: list[bytes], prompts: list[str]) -> dict[str, Any]:
    """Encode a general-reward batch as a JSON-compatible object."""
    images = _require_list(images, "images")
    prompts = _validate_prompts(prompts, len(images))
    return {
        "images": [_encode_bytes(image, "images") for image in images],
        "prompts": prompts,
    }


def decode_general_request(payload: Any) -> tuple[list[bytes], list[str]]:
    """Validate and decode a general-reward request."""
    if not isinstance(payload, dict):
        raise ValueError("request payload must be a JSON object")
    images = _require_list(payload.get("images"), "images")
    prompts = _validate_prompts(payload.get("prompts"), len(images))
    return [_decode_bytes(image, "images") for image in images], prompts


def encode_reward_3d_request(
    videos: list[list[bytes]],
    prompts: list[str],
    camera_trajectories: list[Any] | None = None,
) -> dict[str, Any]:
    """Encode a 3D-reward batch as a JSON-compatible object."""
    videos = _require_list(videos, "videos")
    prompts = _validate_prompts(prompts, len(videos))
    encoded_videos = []
    for video in videos:
        video = _require_list(video, "videos")
        encoded_videos.append([_encode_bytes(frame, "videos") for frame in video])

    payload = {"videos": encoded_videos, "prompts": prompts}
    if camera_trajectories is not None:
        camera_trajectories = _require_list(camera_trajectories, "camera_trajectories")
        if len(camera_trajectories) != len(videos):
            raise ValueError("video and camera trajectory batch sizes must match")
        payload["camera_trajectories"] = _to_json_compatible(camera_trajectories)
    return payload


def decode_reward_3d_request(
    payload: Any,
) -> tuple[list[list[bytes]], list[str], list[Any] | None]:
    """Validate and decode a 3D-reward request."""
    if not isinstance(payload, dict):
        raise ValueError("request payload must be a JSON object")
    videos = _require_list(payload.get("videos"), "videos")
    prompts = _validate_prompts(payload.get("prompts"), len(videos))

    decoded_videos = []
    for video in videos:
        video = _require_list(video, "videos")
        decoded_videos.append([_decode_bytes(frame, "videos") for frame in video])

    camera_trajectories = payload.get("camera_trajectories")
    if camera_trajectories is not None:
        camera_trajectories = _require_list(camera_trajectories, "camera_trajectories")
        if len(camera_trajectories) != len(videos):
            raise ValueError("video and camera trajectory batch sizes must match")

    return decoded_videos, prompts, camera_trajectories
