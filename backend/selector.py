# Central algorithm selector
# Routes between epsilon, softmax, and hybrid strategies

from epsilon_greedy import choose_action as epsilon_choice
from softmax_algo import choose_action as softmax_choice

def select_action(Q, attempts, algo):
    if algo == "epsilon":
        return epsilon_choice(Q, attempts)
    elif algo == "softmax":
        return softmax_choice(Q, attempts)
    elif algo == "hybrid":
        if attempts < 20:
            return epsilon_choice(Q, attempts)
        return softmax_choice(Q, attempts)

    return epsilon_choice(Q, attempts)
