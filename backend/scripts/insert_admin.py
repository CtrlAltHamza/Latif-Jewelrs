import pymysql
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv("DB_HOST", "192.168.240.1"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "root123root123"),
    database=os.getenv("DB_NAME", "latif_jewels")
)
cur = conn.cursor()

username = "admin"
password = "strongpassword123"
pw_hash = generate_password_hash(password)

# Delete if exists
cur.execute("DELETE FROM admin_users WHERE username=%s", (username,))
# Insert new
cur.execute("INSERT INTO admin_users (username, password_hash) VALUES (%s, %s)", (username, pw_hash))
conn.commit()

print(f"✅ Admin user '{username}' created successfully!")
print(f"Login with - Username: {username}, Password: {password}")

cur.close()
conn.close()