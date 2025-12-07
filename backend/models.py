import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "192.168.240.1")
DB_USER = os.getenv("DB_USER", "jewellery_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root123root123")
DB_NAME = os.getenv("DB_NAME", "latif_jewels")
DB_PORT = int(os.getenv("DB_PORT", 3306))

def get_connection():
    return pymysql.connect(
        user='jewellery_user',
        password='strongpassword',
        database='latif_jewels',
        host='192.168.240.1',
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )


# -----------------------
# Admin user functions
# -----------------------
def get_admin_user(username):
    db = get_connection()
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cur.fetchone()
    db.close()
    return user

# -----------------------
# Rates functions
# -----------------------
def get_rates():
    db = get_connection()
    cur = db.cursor()
    cur.execute("SELECT * FROM rates ORDER BY id DESC LIMIT 1")
    rates = cur.fetchone()
    db.close()
    return rates

def update_rates(gold_tola, gold_gram, silver_tola, silver_gram):
    db = get_connection()
    cursor = db.cursor()
    try:
        cursor.execute("""
            UPDATE rates
            SET gold_per_tola = %s,
                gold_per_gram = %s,
                silver_per_tola = %s,
                silver_per_gram = %s,
                updated_at = NOW()
            WHERE id = 1
        """, (gold_tola, gold_gram, silver_tola, silver_gram))
        db.commit()  # <-- commit is essential
    except Exception as e:
        db.rollback()
        print("Error updating rates:", e)
    finally:
        cursor.close()
        db.close()
