import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MYSQL_HOST = os.getenv("192.168.240.1")
    MYSQL_PORT = int(os.getenv("3306"))
    MYSQL_USER = os.getenv("root")
    MYSQL_PASSWORD = os.getenv("root123root123")
    MYSQL_DB = os.getenv("latif_jewels")
