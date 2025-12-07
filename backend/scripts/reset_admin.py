import os
import sys
import pymysql
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

# Load .env from parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DB_HOST = os.getenv("DB_HOST", "192.168.240.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "root123root123")
DB_NAME = os.getenv("DB_NAME", "latif_jewels")
DB_PORT = int(os.getenv("DB_PORT", 3306))

print(f"[DEBUG] Connecting to {DB_HOST}:{DB_PORT} as {DB_USER} to database {DB_NAME}")

if len(sys.argv) < 3:
    print("Usage: python3 reset_admin.py <username> <new_password>")
    sys.exit(1)

username = sys.argv[1]
new_password = sys.argv[2]
pw_hash = generate_password_hash(new_password)

try:
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("UPDATE admin_users SET password_hash=%s WHERE username=%s", (pw_hash, username))
    conn.commit()
    
    if cur.rowcount > 0:
        print(f"✓ Password updated for '{username}'.")
    else:
        print(f"✗ No admin user found with username '{username}'.")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)