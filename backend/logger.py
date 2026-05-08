# Logs experiment data for analysis and research evaluation

import json
import os

LOG_FILE = "data/experiment_log.json"

def log_event(entry):
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

    with open(LOG_FILE, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=2)
