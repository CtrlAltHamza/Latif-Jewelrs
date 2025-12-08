import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cur = conn.cursor()

# Create tables
cur.execute("""
CREATE TABLE IF NOT EXISTS rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gold_per_tola DECIMAL(10, 2),
    gold_per_gram DECIMAL(10, 2),
    silver_per_tola DECIMAL(10, 2),
    silver_per_gram DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
print("✅ Database tables created!")
cur.close()
conn.close()