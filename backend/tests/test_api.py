import pytest

USER_ID = "test_api_user"
MODULE = "numbers"


class TestNextContent:
    def test_returns_valid_modality(self, app):
        resp = app.post("/next-content", json={
            "user_id": USER_ID, "module": MODULE
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["recommended_content"] in ("flashcard", "video", "game")

    def test_respects_algo_param(self, app):
        resp = app.post("/next-content?algo=epsilon", json={
            "user_id": USER_ID, "module": MODULE
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["algorithm_used"] == "epsilon"

    def test_softmax_algo_param(self, app):
        resp = app.post("/next-content?algo=softmax", json={
            "user_id": USER_ID, "module": MODULE
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["algorithm_used"] == "softmax"


class TestFeedback:
    def test_feedback_updates_q_value(self, app):
        app.post("/next-content", json={
            "user_id": USER_ID, "module": MODULE
        })
        resp = app.post("/feedback", json={
            "user_id": USER_ID,
            "module": MODULE,
            "modality": "flashcard",
            "action": "replay",
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert "new_q" in data
        assert 0 <= data["new_q"] <= 1


class TestFullCycle:
    def test_epsilon_full_cycle(self, app):
        uid = "cyc_eps"
        resp1 = app.post("/next-content", json={
            "user_id": uid, "module": MODULE
        })
        modality = resp1.get_json()["recommended_content"]

        app.post("/feedback", json={
            "user_id": uid, "module": MODULE,
            "modality": modality, "action": "skip",
        })

        resp2 = app.post("/next-content", json={
            "user_id": uid, "module": MODULE
        })
        assert resp2.status_code == 200

    def test_softmax_full_cycle(self, app):
        uid = "cyc_smx"
        resp1 = app.post("/next-content?algo=softmax", json={
            "user_id": uid, "module": MODULE
        })
        modality = resp1.get_json()["recommended_content"]

        app.post("/feedback", json={
            "user_id": uid, "module": MODULE,
            "modality": modality, "action": "next",
        })

        resp2 = app.post("/next-content?algo=softmax", json={
            "user_id": uid, "module": MODULE
        })
        assert resp2.status_code == 200
        assert resp2.get_json()["algorithm_used"] == "softmax"
