from flask import Blueprint, request, jsonify
from epsilon_greedy import apply_skip_avoidance

from user_model import (
    initialize_user,
    get_attempts,
    get_q_values,
    get_module_score,
    increment_attempts,
    update_q,
    update_history,
    update_module_score,
    get_global
)

from epsilon_greedy import (
    decide_next_content,
    get_reward,
    update_q_value
)

content_bp = Blueprint("content", __name__)


@content_bp.route("/next-content", methods=["POST"])
def next_content():
    data = request.json

    user_id = data.get("user_id")
    module = data.get("module")

    # Ensure user exists
    initialize_user(user_id)

    # Fetch data
    attempts = get_attempts(user_id)

    Q = get_q_values(user_id)
    global_data = get_global(user_id)
    history = global_data["history"]
    Q = apply_skip_avoidance(Q, history)
    score = get_module_score(user_id, module)

    # Decide next content
    action = decide_next_content(score, Q, attempts)

    # Increment attempts
    increment_attempts(user_id)

    return jsonify({
        "module": module,
        "recommended_content": action,
        "attempts": attempts
    })

@content_bp.route("/feedback", methods=["POST"])
def feedback():
    data = request.json

    user_id = data.get("user_id")
    module = data.get("module")
    modality = data.get("modality")
    action = data.get("action")

    # Get Q-values
    Q = get_q_values(user_id)
    old_q = Q[modality]

    # Reward
    reward = get_reward(action)

    # Update Q
    new_q = update_q_value(old_q, reward)
    new_q = max(0, min(1, new_q))
    update_q(user_id, modality, new_q)

    # Update module score
    old_score = get_module_score(user_id, module)
    new_score = old_score + 0.1 * reward
    new_score = max(0, min(1, new_score))

    update_module_score(user_id, module, new_score)

    # Update history
    update_history(user_id, {
        "module": module,
        "modality": modality,
        "action": action,
        "reward": reward
    })

    return jsonify({
        "message": "feedback recorded",
        "new_q": new_q,
        "new_score": new_score
    })