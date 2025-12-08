import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

try:
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

    # Insert admin user
    from werkzeug.security import generate_password_hash
    pw_hash = generate_password_hash("strongpassword123")
    cur.execute("DELETE FROM admin_users WHERE username=%s", ("admin",))
    cur.execute("INSERT INTO admin_users (username, password_hash) VALUES (%s, %s)", ("admin", pw_hash))

    conn.commit()
    print("✅ Database setup complete on Railway MySQL!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"❌ Error: {e}")