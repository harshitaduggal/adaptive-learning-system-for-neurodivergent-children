# Implements Softmax/Boltzmann action selection
# Converts Q-values into probabilities for smoother exploration

import random
import math

ACTIONS = ["flashcard", "video", "audio"]

def get_temperature(attempts):
    if attempts < 20:
        return 1.0
    elif attempts < 50:
        return 0.5
    return 0.2

def softmax(Q, temp):
    exp_vals = {k: math.exp(v / temp) for k, v in Q.items()}
    total = sum(exp_vals.values())
    return {k: v / total for k, v in exp_vals.items()}

def choose_action(Q, attempts):
    temp = get_temperature(attempts)
    probs = softmax(Q, temp)

    rand = random.random()
    cumulative = 0

    for action, prob in probs.items():
        cumulative += prob
        if rand < cumulative:
            return action

    return random.choice(ACTIONS)
