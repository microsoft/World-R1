import unittest
from unittest.mock import patch

import torch

from flow_grpo import rewards
from reward_server.protocol import (
    decode_general_request,
    decode_reward_3d_request,
    encode_general_request,
    encode_reward_3d_request,
)
from scripts import serve_general_reward, serve_reward_3d


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def raise_for_status(self):
        return None

    def json(self):
        return self.payload


class FakeSession:
    def __init__(self, response):
        self.response = response
        self.requests = []
        self.trust_env = True

    def mount(self, *args, **kwargs):
        return None

    def post(self, url, **kwargs):
        self.requests.append((url, kwargs))
        return FakeResponse(self.response)


class FakeGeneralRewardManager:
    def __init__(self):
        self.calls = []

    def compute_batch_scores(self, images, prompts):
        self.calls.append((images, prompts))
        return [0.75] * len(images)


class FakeReward3DManager:
    def __init__(self):
        self.calls = []
        self.last_results = {
            "per_video_results": [
                {
                    "gs_score": 0.25,
                    "meta_score": 0.5,
                    "camera_motion_score": 0.75,
                    "trajectory_comparison_path": "trajectory.png",
                }
            ]
        }

    def compute_batch_scores(self, videos, prompts, camera_trajectories=None):
        self.calls.append((videos, prompts, camera_trajectories))
        return [1.5] * len(videos)


class RewardProtocolTest(unittest.TestCase):
    def test_general_request_round_trip(self):
        images = [b"first-image", b"\x00\xffsecond-image"]
        prompts = ["first prompt", "second prompt"]

        payload = encode_general_request(images, prompts)

        self.assertEqual(decode_general_request(payload), (images, prompts))
        self.assertTrue(all(isinstance(image, str) for image in payload["images"]))

    def test_reward_3d_request_round_trip(self):
        videos = [[b"frame-1", b"frame-2"], [b"frame-3"]]
        prompts = ["first prompt", "second prompt"]
        trajectories = [{"frame_0": [[1.0, 0.0], [0.0, 1.0]]}, None]

        payload = encode_reward_3d_request(videos, prompts, trajectories)

        self.assertEqual(
            decode_reward_3d_request(payload),
            (videos, prompts, trajectories),
        )
        self.assertTrue(
            all(isinstance(frame, str) for video in payload["videos"] for frame in video)
        )

    def test_decoders_reject_invalid_payloads(self):
        with self.assertRaises(ValueError):
            decode_general_request({"images": ["not-base64"], "prompts": ["prompt"]})

        with self.assertRaises(ValueError):
            decode_general_request({"images": [], "prompts": ["extra prompt"]})

        with self.assertRaises(ValueError):
            decode_reward_3d_request(
                {
                    "videos": [["ZnJhbWU="]],
                    "prompts": ["prompt"],
                    "camera_trajectories": [],
                }
            )

    def test_general_server_accepts_json_and_rejects_binary_payloads(self):
        manager = FakeGeneralRewardManager()
        app = serve_general_reward.create_app(manager=manager)
        client = app.test_client()

        response = client.post(
            "/",
            json=encode_general_request([b"image"], ["prompt"]),
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"outputs": [0.75]})
        self.assertEqual(manager.calls, [([b"image"], ["prompt"])])

        response = client.post(
            "/",
            data=b"\x80\x04untrusted-pickle-payload",
            content_type="application/octet-stream",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.mimetype, "application/json")
        self.assertEqual(len(manager.calls), 1)

    def test_reward_3d_server_accepts_json_and_rejects_binary_payloads(self):
        manager = FakeReward3DManager()
        app = serve_reward_3d.create_app(
            manager=manager,
            install_signal_handlers=False,
        )
        client = app.test_client()
        trajectories = [{"frame_0": "1 0 0 0"}]

        response = client.post(
            "/",
            json=encode_reward_3d_request([[b"frame"]], ["prompt"], trajectories),
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {
                "outputs": [1.5],
                "details": manager.last_results["per_video_results"],
            },
        )
        self.assertEqual(manager.calls, [([[b"frame"]], ["prompt"], trajectories)])

        response = client.post(
            "/",
            data=b"\x80\x04untrusted-pickle-payload",
            content_type="application/octet-stream",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.mimetype, "application/json")
        self.assertEqual(len(manager.calls), 1)

    def test_reward_clients_send_json(self):
        general_session = FakeSession({"outputs": [0.5]})
        with patch.object(rewards.requests, "Session", return_value=general_session):
            score_fn = rewards.remote_reward_general("cpu")
            scores, metadata = score_fn(
                torch.zeros(1, 3, 2, 2),
                ["prompt"],
                [{}],
            )

        self.assertEqual(scores, [0.5])
        self.assertEqual(metadata, {})
        _, general_kwargs = general_session.requests[0]
        self.assertNotIn("data", general_kwargs)
        images, prompts = decode_general_request(general_kwargs["json"])
        self.assertEqual(len(images), 1)
        self.assertTrue(images[0].startswith(b"\xff\xd8"))
        self.assertEqual(prompts, ["prompt"])

        reward_3d_session = FakeSession({"outputs": [1.0], "details": None})
        with patch.object(rewards.requests, "Session", return_value=reward_3d_session):
            score_fn = rewards.remote_reward_3d("cpu")
            scores, metadata = score_fn(
                torch.zeros(1, 1, 3, 2, 2),
                ["prompt"],
                [{"camera_trajectory": {"frame_0": "1 0 0 0"}}],
            )

        self.assertEqual(scores, [1.0])
        self.assertEqual(metadata, {})
        _, reward_3d_kwargs = reward_3d_session.requests[0]
        self.assertNotIn("data", reward_3d_kwargs)
        videos, prompts, trajectories = decode_reward_3d_request(
            reward_3d_kwargs["json"]
        )
        self.assertEqual(len(videos), 1)
        self.assertEqual(len(videos[0]), 1)
        self.assertTrue(videos[0][0].startswith(b"\xff\xd8"))
        self.assertEqual(prompts, ["prompt"])
        self.assertEqual(trajectories, [{"frame_0": "1 0 0 0"}])


if __name__ == "__main__":
    unittest.main()
