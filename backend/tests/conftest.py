import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
import json
import tempfile


@pytest.fixture
def tmp_data_file():
    tmp = tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json")
    json.dump({}, tmp)
    tmp.close()

    import user_model
    original = user_model.FILE
    user_model.FILE = tmp.name

    yield tmp.name

    user_model.FILE = original
    try:
        os.unlink(tmp.name)
    except OSError:
        pass


@pytest.fixture
def sample_q():
    return {"flashcard": 0.8, "video": 0.5, "game": 0.2}


@pytest.fixture
def app(tmp_data_file):
    from app import app as flask_app
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client
