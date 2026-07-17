import os
import argparse
import signal
import sys
from reward_server.protocol import decode_reward_3d_request

# import debugpy
# try:
#     # 5678 is the default attach port in the VS Code debug configurations. Unless a host and port are specified, host defaults to 127.0.0.1
#     debugpy.listen(("localhost", 9588))
#     print("Waiting for debugger attach")
#     debugpy.wait_for_client()
# except Exception as e:
#     pass

from flask import Blueprint, Flask, current_app, jsonify, request

root = Blueprint("root", __name__)

reward_3d_manager = None

def signal_handler(sig, frame):
    """Handle shutdown signals gracefully"""
    global reward_3d_manager
    print("\nReceived shutdown signal. Cleaning up...")
    if reward_3d_manager:
        reward_3d_manager.shutdown()
    sys.exit(0)

def create_app(scorer_type='qwen', use_lpips=True, manager=None, install_signal_handlers=True):
    global reward_3d_manager
    if manager is None:
        from reward_server.reward_3d import MultiGPUReward3DManager

        print(f"Initializing multi-GPU 3D reward server (scorer: {scorer_type}, lpips: {use_lpips})...")
        manager = MultiGPUReward3DManager(scorer_type=scorer_type, use_lpips=use_lpips)
        manager.initialize()
    reward_3d_manager = manager

    # Register signal handlers for graceful shutdown
    if install_signal_handlers:
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    app = Flask(__name__)
    app.register_blueprint(root)
    return app

@root.route("/", methods=["POST"])
def inference():
    print(f"received POST request from {request.remote_addr}")
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        # expects a dict with "videos" and "prompts"
        # videos: List[List[bytes]] - outer list is batch_size, inner list is frames per video
        # prompts: List[str] - text prompts for each video
        batch_videos, batch_prompts, batch_camera_trajectories = decode_reward_3d_request(
            request.get_json(silent=True)
        )
        batch_size = len(batch_videos)
        print(f"Got batch of size {batch_size} for 3D reward evaluation")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    try:
        global reward_3d_manager
        if reward_3d_manager is None:
            print("Error: 3D reward server is not initialized")
            outputs = [0.0] * batch_size
            details = None
        else:
            outputs = reward_3d_manager.compute_batch_scores(
                batch_videos,
                batch_prompts,
                camera_trajectories=batch_camera_trajectories,
            )
            details = getattr(reward_3d_manager, "last_results", {}).get("per_video_results")

        print(f"3D reward batch processing results: {outputs}")

        return jsonify({
            "outputs": [float(output) for output in outputs],
            "details": details,
        }), 200
    except Exception:
        current_app.logger.exception("3D reward computation failed")
        return jsonify({"error": "3D reward computation failed"}), 500


HOST = "127.0.0.1"
PORT = 8089  # Default port used by flow_grpo/reward-server integration

if __name__ == "__main__":
    # CRITICAL: Set multiprocessing start method to 'spawn' for CUDA compatibility
    # This ensures each subprocess gets a fresh Python interpreter and CUDA context
    import multiprocessing as mp
    try:
        mp.set_start_method('spawn')
    except RuntimeError:
        # Start method already set
        pass

    parser = argparse.ArgumentParser(description="3D reward server")
    parser.add_argument(
        "--host",
        default=os.getenv("REWARD_3D_HOST", HOST),
        help="Host to bind (env: REWARD_3D_HOST)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("REWARD_3D_PORT", PORT)),
        help="Port to listen on (env: REWARD_3D_PORT)",
    )
    parser.add_argument(
        "--scorer",
        type=str,
        choices=['qwen', 'openai'],
        default=os.getenv("REWARD_3D_SCORER", "qwen"),
        help="Scorer type for meta-view and reconstruction evaluation (env: REWARD_3D_SCORER)",
    )
    parser.add_argument(
        "--lpips",
        dest="lpips",
        action="store_true",
        help="Use LPIPS for reconstruction scoring instead of Qwen3-VL",
    )
    parser.add_argument(
        "--no-lpips",
        dest="lpips",
        action="store_false",
        help="Disable LPIPS reconstruction scoring and use Qwen3-VL instead",
    )
    parser.set_defaults(
        lpips=os.getenv("REWARD_3D_USE_LPIPS", "1").strip().lower() not in {"0", "false", "no"}
    )
    args = parser.parse_args()

    create_app(scorer_type=args.scorer, use_lpips=args.lpips).run(args.host, args.port)
