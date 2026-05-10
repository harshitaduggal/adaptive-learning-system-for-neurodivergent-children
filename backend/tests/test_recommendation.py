import pytest
from epsilon_greedy import apply_skip_avoidance, get_reward, update_q_value
from user_model import initialize_user, get_q_values, get_attempts, get_global


class TestSkipAvoidance:
    def test_penalizes_modality_with_two_skips(self, sample_q):
        history = [
            {"action": "skip", "modality": "video"},
            {"action": "skip", "modality": "video"},
        ]
        result = apply_skip_avoidance(sample_q.copy(), history)
        assert result["video"] == pytest.approx(0.5 - 0.2)

    def test_no_penalty_for_single_skip(self, sample_q):
        history = [
            {"action": "skip", "modality": "video"},
            {"action": "next", "modality": "video"},
        ]
        result = apply_skip_avoidance(sample_q.copy(), history)
        assert result["video"] == 0.5

    def test_only_checks_recent_three_events(self, sample_q):
        history = [
            {"action": "skip", "modality": "video"},
            {"action": "skip", "modality": "video"},
            {"action": "next", "modality": "flashcard"},
            {"action": "next", "modality": "game"},
        ]
        result = apply_skip_avoidance(sample_q.copy(), history)
        assert result["video"] == 0.5


class TestQConvergence:
    def test_q_converges_toward_replay_reward(self):
        q = 0.5
        for _ in range(20):
            q = update_q_value(q, reward=0.3)
        assert 0.25 <= q <= 0.35

    def test_q_converges_toward_zero_on_skips(self):
        q = 0.5
        for _ in range(20):
            q = update_q_value(q, reward=-0.2)
            q = max(0, min(1, q))
        assert q == 0.0


class TestUserInitialization:
    def test_initial_q_values(self, tmp_data_file):
        initialize_user("new_user")
        assert get_q_values("new_user") == {
            "flashcard": 0.5, "video": 0.5, "game": 0.5
        }

    def test_initial_attempts_zero(self, tmp_data_file):
        initialize_user("new_user")
        assert get_attempts("new_user") == 0

    def test_initial_history_empty(self, tmp_data_file):
        initialize_user("new_user")
        assert get_global("new_user")["history"] == []

    def test_reinitializing_does_not_reset(self, tmp_data_file):
        initialize_user("persistent_user")
        from user_model import update_q
        update_q("persistent_user", "flashcard", 0.9)
        initialize_user("persistent_user")
        assert get_q_values("persistent_user")["flashcard"] == 0.9
