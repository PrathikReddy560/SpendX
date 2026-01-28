import sqlite3
import random
import os
from datetime import date, timedelta

# --- ABSOLUTE PATH SETUP (MATCHING DATABASE.PY) ---
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
DB_FOLDER = os.path.join(PROJECT_ROOT, "data")
DB_FILE = "expenses.db"
DB_PATH = os.path.join(DB_FOLDER, DB_FILE)
# --------------------------------------------------

def seed_database():
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)
    
    print(f"🎯 Targeting Database at: {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Create table
    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            category TEXT,
            amount REAL,
            description TEXT
        )
    ''')
    
    # Clear old data
    c.execute("DELETE FROM expenses")
    
    # Generate Data
    categories = ['Food', 'Travel', 'Grocery', 'Shopping', 'Bills']
    descriptions = {
        'Food': ['Swiggy', 'Pizza', 'Burger King', 'Chai'],
        'Travel': ['Uber', 'Metro', 'Petrol'],
        'Grocery': ['Zepto', 'Milk', 'Vegetables'],
        'Shopping': ['Amazon', 'Myntra', 'Shoes'],
        'Bills': ['Electricity', 'Netflix', 'Mobile']
    }

    print("🌱 Planting data...")
    for _ in range(50):
        cat = random.choice(categories)
        desc = random.choice(descriptions[cat])
        fake_date = date.today() - timedelta(days=random.randint(0, 30))
        amt = random.randint(50, 2000)
        
        c.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)", 
                  (fake_date, cat, amt, desc))

    conn.commit()
    conn.close()
    print("✅ Done! Data inserted.")

if __name__ == "__main__":
    seed_database()