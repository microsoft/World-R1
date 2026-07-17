#!/usr/bin/env python3
import argparse
import os

from flask import Blueprint, Flask, current_app, jsonify, request

from reward_server.protocol import decode_general_request

root = Blueprint("root", __name__)
general_reward_manager = None


def create_app(manager=None):
    global general_reward_manager
    if manager is None:
        from reward_server.general_reward import MultiGPUGeneralRewardManager

        manager = MultiGPUGeneralRewardManager()
        manager.initialize()
    general_reward_manager = manager
    app = Flask(__name__)
    app.register_blueprint(root)
    return app


@root.route("/", methods=["POST"])
def inference():
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        batch_images, batch_prompts = decode_general_request(request.get_json(silent=True))
        batch_size = len(batch_images)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    try:
        global general_reward_manager
        if general_reward_manager is None:
            outputs = [0.5] * batch_size
        else:
            outputs = general_reward_manager.compute_batch_scores(batch_images, batch_prompts)

        return jsonify({"outputs": [float(output) for output in outputs]}), 200
    except Exception:
        current_app.logger.exception("General reward computation failed")
        return jsonify({"error": "General reward computation failed"}), 500


HOST = "127.0.0.1"
PORT = 8090


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="General reward server")
    parser.add_argument("--host", default=os.getenv("GENERAL_REWARD_HOST", HOST))
    parser.add_argument("--port", type=int, default=int(os.getenv("GENERAL_REWARD_PORT", PORT)))
    args = parser.parse_args()
    create_app().run(args.host, args.port)
