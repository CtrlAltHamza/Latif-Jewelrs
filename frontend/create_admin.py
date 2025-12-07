# create_admin.py
from app import create_app
from models import db, User
from flask_bcrypt import Bcrypt
import getpass

app = create_app()
bcrypt = Bcrypt(app)

with app.app_context():
    username = input("Admin username: ").strip()
    pwd = getpass.getpass("Admin password (will be hidden): ")
    if User.query.filter_by(username=username).first():
        print("User exists")
    else:
        user = User(
            username=username,
            password_hash=bcrypt.generate_password_hash(pwd).decode('utf-8')
        )
        db.session.add(user)
        db.session.commit()
        print("Admin created:", username)
