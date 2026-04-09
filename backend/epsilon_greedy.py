import random

# Available modalities
ACTIONS = ["flashcard", "video", "audio"]


# Initialize Q-values
def initialize_q():
    return {action: 0.5 for action in ACTIONS}


# Dynamic epsilon (optimized for short sessions)
def get_epsilon(attempts):
    if attempts < 3:
        return 0.4
    elif attempts < 10:
        return 0.2
    else:
        return 0.1


# Reward system (based on behavior)
def get_reward(event):
    if event == "replay":
        return 1.0
    elif event == "skip":
        return -0.8   # softer penalty
    else:
        return 0.2


# Update Q-values (learning step)
def update_q_value(old_q, reward, alpha=0.3):
    return old_q + alpha * (reward - old_q)


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


# Game trigger (separate from learning logic)
def should_show_game(attempts):
    return attempts > 0 and attempts % 4 == 0


# FINAL decision function
def decide_next_content(score, Q, attempts):
    if should_show_game(attempts):
        return "game"

    return choose_action(Q, attempts)