# models.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Rates(db.Model):
    __tablename__ = 'rates'
    id = db.Column(db.Integer, primary_key=True)
    gold_per_tola = db.Column(db.Numeric(12,3), nullable=False)
    gold_per_gram = db.Column(db.Numeric(12,3), nullable=False)
    silver_per_tola = db.Column(db.Numeric(12,3), nullable=False)
    silver_per_gram = db.Column(db.Numeric(12,3), nullable=False)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
