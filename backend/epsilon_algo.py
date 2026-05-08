# Reinforcement learning utilities:
# epsilon-greedy selection, rewards, Q-value updates, skip avoidance

import random

ACTIONS = ["flashcard", "video", "audio"]

def get_epsilon(attempts):
    if attempts < 20:
        return 0.5
    elif attempts < 50:
        return 0.3
    return 0.1

def choose_action(Q, attempts):
    epsilon = get_epsilon(attempts)

    if random.random() < epsilon:
        return random.choice(ACTIONS)
    return max(Q, key=Q.get)
