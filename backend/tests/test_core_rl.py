import math
import pytest
from epsilon_greedy import get_reward, update_q_value, get_epsilon, get_best_action
from softmax_algo import softmax


class TestGetReward:
    def test_replay_returns_0_3(self):
        assert get_reward("replay") == 0.3

    def test_next_returns_0_1(self):
        assert get_reward("next") == 0.1

    def test_skip_returns_neg_0_2(self):
        assert get_reward("skip") == -0.2

    def test_unknown_event_defaults_to_0_3(self):
        assert get_reward("unknown_event") == 0.3


class TestUpdateQValue:
    def test_q_update_math(self):
        result = update_q_value(old_q=0.5, reward=0.3, alpha=0.3)
        expected = round(0.5 + 0.3 * (0.3 - 0.5), 2)
        assert result == expected

    def test_q_update_default_alpha(self):
        result = update_q_value(old_q=0.5, reward=0.3)
        expected = round(0.5 + 0.3 * (0.3 - 0.5), 2)
        assert result == expected == 0.44

    def test_q_update_negative_reward(self):
        result = update_q_value(old_q=0.5, reward=-0.2)
        expected = round(0.5 + 0.3 * (-0.2 - 0.5), 2)
        assert result == expected == 0.29


class TestEpsilonDecay:
    def test_epsilon_below_20(self):
        for a in [0, 1, 10, 19]:
            assert get_epsilon(a) == 0.5, f"failed at attempts={a}"

    def test_epsilon_20_to_49(self):
        for a in [20, 25, 30, 49]:
            assert get_epsilon(a) == 0.3, f"failed at attempts={a}"

    def test_epsilon_50_and_above(self):
        for a in [50, 100, 1000]:
            assert get_epsilon(a) == 0.1, f"failed at attempts={a}"


class TestSoftmax:
    def test_probabilities_sum_to_one(self, sample_q):
        probs = softmax(sample_q, temp=1.0)
        assert abs(sum(probs.values()) - 1.0) < 1e-9

    def test_higher_q_gets_higher_probability(self, sample_q):
        probs = softmax(sample_q, temp=1.0)
        assert probs["flashcard"] > probs["video"] > probs["game"]

    def test_high_temperature_near_uniform(self, sample_q):
        probs = softmax(sample_q, temp=100.0)
        for v in probs.values():
            assert abs(v - 1 / 3) < 0.02

    def test_low_temperature_near_greedy(self, sample_q):
        probs = softmax(sample_q, temp=0.05)
        assert probs["flashcard"] > 0.99


class TestGetBestAction:
    def test_returns_max_q_modality(self, sample_q):
        assert get_best_action(sample_q) == "flashcard"

    def test_returns_first_on_tie(self):
        assert get_best_action({"a": 0.5, "b": 0.5}) in ["a", "b"]
