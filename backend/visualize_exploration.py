import matplotlib.pyplot as plt
import numpy as np

# Import project modules
from epsilon_greedy import get_epsilon, ACTIONS
from softmax_algo import get_temperature, softmax

# --- Epsilon Decay ---
attempts_range = list(range(0, 101))
epsilons = [get_epsilon(a) for a in attempts_range]

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.step(attempts_range, epsilons, where="post", linewidth=2, color="crimson")
plt.axvline(20, color="gray", linestyle="--", alpha=0.5, label="attempts = 20")
plt.axvline(50, color="gray", linestyle="--", alpha=0.5, label="attempts = 50")
plt.title("Epsilon Decay (Epsilon-Greedy)")
plt.xlabel("Attempts")
plt.ylabel("Epsilon (exploration rate)")
plt.ylim(0, 1)
plt.grid(alpha=0.3)
plt.legend()

# --- Softmax: Temperature Decay + Probability Distributions ---
plt.subplot(1, 2, 2)
temps = [get_temperature(a) for a in attempts_range]
plt.step(attempts_range, temps, where="post", linewidth=2, color="teal")
plt.axvline(20, color="gray", linestyle="--", alpha=0.5, label="attempts = 20")
plt.axvline(50, color="gray", linestyle="--", alpha=0.5, label="attempts = 50")
plt.title("Temperature Decay (Softmax)")
plt.xlabel("Attempts")
plt.ylabel("Temperature")
plt.grid(alpha=0.3)
plt.legend()

plt.tight_layout()
plt.savefig("exploration_decay.png", dpi=150)
plt.show()

# --- Softmax Probability Distributions at Different Temperatures ---
sample_q = {"flashcard": 0.8, "video": 0.5, "game": 0.3}

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
temperatures = [1.0, 0.5, 0.1]
colors = ["#2E86AB", "#A23B72", "#F18F01"]

for idx, temp in enumerate(temperatures):
    probs = softmax(sample_q, temp)
    actions = list(probs.keys())
    values = list(probs.values())

    bars = axes[idx].bar(actions, values, color=colors, edgecolor="white", linewidth=1.2)
    axes[idx].set_ylim(0, 1)
    axes[idx].set_title(f"Temperature = {temp}")
    axes[idx].set_ylabel("Probability")
    axes[idx].grid(axis="y", alpha=0.3)

    for bar, val in zip(bars, values):
        axes[idx].text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.02,
                       f"{val:.2f}", ha="center", fontsize=10)

plt.suptitle("Softmax Action Probabilities at Different Temperatures\n(Q-values: flashcard=0.8, video=0.5, game=0.3)",
             fontweight="bold")
plt.tight_layout()
plt.savefig("softmax_probabilities.png", dpi=150)
plt.show()

# --- Side-by-side: Epsilon vs Softmax selection probability for best action ---
best_q = 0.8
second_q = 0.5
third_q = 0.3

attempts = list(range(0, 101))

# Epsilon: probability of choosing the best action = (1 - epsilon) + epsilon/3
epsilon_probs = []
for a in attempts:
    eps = get_epsilon(a)
    p = (1 - eps) + eps / 3
    epsilon_probs.append(p)

# Softmax: probability of choosing the best action
softmax_probs = []
for a in attempts:
    temp = get_temperature(a)
    qs = {"best": best_q, "second": second_q, "third": third_q}
    probs = softmax(qs, temp)
    softmax_probs.append(probs["best"])

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(attempts, epsilon_probs, linewidth=2, color="crimson")
plt.title("Epsilon-Greedy: P(choose best action)")
plt.xlabel("Attempts")
plt.ylabel("Probability")
plt.ylim(0, 1)
plt.grid(alpha=0.3)

plt.subplot(1, 2, 2)
plt.plot(attempts, softmax_probs, linewidth=2, color="teal")
plt.title("Softmax: P(choose best action)")
plt.xlabel("Attempts")
plt.ylabel("Probability")
plt.ylim(0, 1)
plt.grid(alpha=0.3)

plt.tight_layout()
plt.savefig("exploration_comparison.png", dpi=150)
plt.show()

print("All graphs saved: exploration_decay.png, softmax_probabilities.png, exploration_comparison.png")
