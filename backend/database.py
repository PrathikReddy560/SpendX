import sqlite3
import pandas as pd
import os

# --- ABSOLUTE PATH SETUP ---
# Get the folder where THIS file (database.py) is located
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up one level to the project root (SpendX/)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
# Define the path: SpendX/data/expenses.db
DB_FOLDER = os.path.join(PROJECT_ROOT, "data")
DB_FILE = "expenses.db"
DB_PATH = os.path.join(DB_FOLDER, DB_FILE)
# ---------------------------

def ensure_db_folder():
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)

def get_db_connection():
    ensure_db_folder()
    conn = sqlite3.connect(DB_PATH)
    return conn

def initialize_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            category TEXT,
            amount REAL,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

def fetch_all_expenses():
    initialize_db()
    conn = get_db_connection()
    try:
        df = pd.read_sql_query("SELECT * FROM expenses ORDER BY date DESC", conn)
        return df
    except Exception as e:
        print(f"Error: {e}")
        return pd.DataFrame(columns=['date', 'category', 'amount', 'description'])
    finally:
        conn.close()

def insert_expense(date, category, amount, description):
    initialize_db()
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)", 
              (date, category, amount, description))
    conn.commit()
    conn.close()