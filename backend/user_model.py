# Handles persistent user state:
# Q-values, attempts, module scores, and interaction history

import json
import os

FILE = "data/users.json"
MAX_HISTORY = 80  # for sliding window


def round_val(value, decimals=2):
    """Round to avoid floating-point precision errors."""
    return round(value, decimals)


# Load users from file
def load_users():
    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r") as f:
        return json.load(f)


# Save users to file
def save_users(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)


# Initialize new user
def initialize_user(user_id):
    users = load_users()

    if user_id not in users:
        users[user_id] = {
            "global": {
                "attempts": 0,
                "Q": {
                    "flashcard": 0.5,
                    "video": 0.5,
                    "audio": 0.5
                },
                "history": []
            },
            "modules": {}
        }
        save_users(users)

    return users[user_id]


# Get user data
def get_user(user_id):
    users = load_users()

    if user_id not in users:
        return initialize_user(user_id)

    return users[user_id]


# Get global data
def get_global(user_id):
    user = get_user(user_id)
    return user["global"]


# Get Q-values
def get_q_values(user_id):
    user = get_user(user_id)
    return user["global"]["Q"]


# Get attempts
def get_attempts(user_id):
    user = get_user(user_id)
    return user["global"]["attempts"]


# Increment attempts
def increment_attempts(user_id):
    users = load_users()

    if user_id not in users:
        users[user_id] = initialize_user(user_id)

    users[user_id]["global"]["attempts"] += 1

    save_users(users)


# Get module score 
def get_module_score(user_id, module):
    users = load_users()

    if user_id not in users:
        users[user_id] = initialize_user(user_id)

    if module not in users[user_id]["modules"]:
        users[user_id]["modules"][module] = {"score": 0.5}
        save_users(users)

    return users[user_id]["modules"][module]["score"]


# Update module score
def update_module_score(user_id, module, new_score):
    users = load_users()

    if user_id not in users:
        users[user_id] = initialize_user(user_id)

    if module not in users[user_id]["modules"]:
        users[user_id]["modules"][module] = {}

    users[user_id]["modules"][module]["score"] = round_val(new_score)

    save_users(users)


# Update Q-values
def update_q(user_id, action, new_q):
    users = load_users()

    if user_id not in users:
        users[user_id] = initialize_user(user_id)

    users[user_id]["global"]["Q"][action] = round_val(new_q)

    save_users(users)


# to Update history (sliding window)
def update_history(user_id, event):
    users = load_users()

    if user_id not in users:
        users[user_id] = initialize_user(user_id)

    history = users[user_id]["global"]["history"]

    history.append(event)

    if len(history) > MAX_HISTORY:
        history.pop(0)

    save_users(users)
