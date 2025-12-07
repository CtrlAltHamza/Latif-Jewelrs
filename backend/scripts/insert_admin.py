import pymysql
from werkzeug.security import generate_password_hash

conn = pymysql.connect(
    host="192.168.240.1",
    user="root",
    password="root123root123",
    database="latif_jewels"
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

print(f"Admin '{username}' inserted with hashed password.")
cur.close()
conn.close()