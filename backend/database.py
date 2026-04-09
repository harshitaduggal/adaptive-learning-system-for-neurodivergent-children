import sqlite3

DB_NAME = "users.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY
    )
    """)

    # Global data
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS global_data (
        user_id TEXT,
        attempts INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )
    """)

    # Q-values
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS q_values (
        user_id TEXT,
        modality TEXT,
        value REAL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )
    """)

    # Modules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS modules (
        user_id TEXT,
        module TEXT,
        score REAL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )
    """)

    # History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        user_id TEXT,
        action TEXT,
        event TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()