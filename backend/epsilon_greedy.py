import random

# Available modalities
ACTIONS = ["flashcard", "video", "game"]


# Initialize Q-values
def initialize_q():
    return {action: 0.5 for action in ACTIONS}


# Dynamic epsilon (optimized for short sessions)
def get_epsilon(attempts):
    if attempts < 20:
        return 0.5
    elif attempts < 50:
        return 0.3
    else:
        return 0.1


# Reward system (based on behavior)
def get_reward(event):
    if event == "replay":
        return 0.3
    elif event == "skip":
        return -0.2
    elif event == "next":
        return 0.1
    else:
        return 0.3


# Update Q-values (learning step)
def update_q_value(old_q, reward, alpha=0.3):
    return round(old_q + alpha * (reward - old_q), 2)


# Get best modality based on learned preference
def get_best_action(Q):
    return max(Q, key=Q.get)


# Epsilon-greedy selection
def choose_action(Q, attempts):
    epsilon = get_epsilon(attempts)

    if random.random() < epsilon:
        return random.choice(ACTIONS)  # explore
    else:
        return get_best_action(Q)      # exploit


# FINAL decision function
def decide_next_content(score, Q, attempts):
    return choose_action(Q, attempts)

def apply_skip_avoidance(Q, history):
    if len(history) < 2:
        return Q

    recent = history[-3:]  # last 3 interactions

    skip_counts = {}

    for h in recent:
        if h["action"] == "skip":
            modality = h["modality"]
            skip_counts[modality] = skip_counts.get(modality, 0) + 1

    # If skipped twice recently → penalize
    for modality, count in skip_counts.items():
        if count >= 2:
            Q[modality] = max(0, Q[modality] - 0.2)  # reduce priority

    return Q