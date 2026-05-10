import pytest
from epsilon_greedy import choose_action as epsilon_choice, ACTIONS as E_ACTIONS
from softmax_algo import choose_action as softmax_choice
from selector import select_action


class TestEpsilonGreedy:
    def test_exploration_at_low_attempts(self, sample_q):
        N = 1000
        results = [epsilon_choice(sample_q, attempts=0) for _ in range(N)]
        best = "flashcard"
        non_best_count = sum(1 for r in results if r != best)
        assert 250 <= non_best_count <= 450, (
            f"Expected ~33% non-best (explore half, ~1/3 random best), got {non_best_count}/{N}"
        )

    def test_exploitation_at_high_attempts(self, sample_q):
        N = 1000
        results = [epsilon_choice(sample_q, attempts=50) for _ in range(N)]
        best = "flashcard"
        best_count = sum(1 for r in results if r == best)
        assert best_count >= 800, (
            f"Expected ≥85% exploitation, got {best_count}/{N}"
        )


class TestSoftmax:
    def test_returns_valid_action(self, sample_q):
        for _ in range(100):
            action = softmax_choice(sample_q, attempts=10)
            assert action in E_ACTIONS

    def test_prefers_high_q_action(self, sample_q):
        N = 1000
        results = [softmax_choice(sample_q, attempts=100) for _ in range(N)]
        best_count = results.count("flashcard")
        worst_count = results.count("game")
        assert best_count > worst_count, (
            f"flashcard={best_count} should exceed game={worst_count} at low temp"
        )


class TestSelector:
    def test_epsilon_routes_correctly(self, sample_q):
        for _ in range(20):
            action = select_action(sample_q, attempts=0, algo="epsilon")
            assert action in E_ACTIONS

    def test_softmax_routes_correctly(self, sample_q):
        for _ in range(20):
            action = select_action(sample_q, attempts=0, algo="softmax")
            assert action in E_ACTIONS
