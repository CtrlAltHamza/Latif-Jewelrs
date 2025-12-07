from werkzeug.security import generate_password_hash
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

db = pymysql.connect(
    host="192.168.240.1",
    user="root",
    password="root123root123",
    database="latif_jewels",
    port=3306
)


username = "admin"
password = "StrongPassword123!"
hashed = generate_password_hash(password)

cur = db.cursor()
cur.execute(
    "INSERT INTO admin_users (username, password_hash) VALUES (%s,%s)",
    (username, hashed)
)
db.commit()

print("Admin user created securely")
