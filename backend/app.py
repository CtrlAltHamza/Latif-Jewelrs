import os
import json
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import pymysql
from werkzeug.security import check_password_hash
from datetime import timedelta
from urllib.parse import urlparse

load_dotenv()

app = Flask(__name__)

# Security configuration
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "change-this-in-production")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.secret_key = os.getenv("JWT_SECRET_KEY")

# CORS - ONLY allow your frontend domain
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://latif-jewelrs121.vercel.app",
            "https://latif-jewelrs.vercel.app",
            "http://localhost:5173",
            "http://localhost:5002"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Security headers
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

JWTManager(app)
limiter = Limiter(key_func=get_remote_address)
limiter.init_app(app)

# Parse Railway MySQL URL format: mysql://user:password@host:port/database
database_url = os.getenv("DATABASE_URL")

if database_url:
    parsed = urlparse(database_url)
    DB_HOST = parsed.hostname
    DB_USER = parsed.username
    DB_PASSWORD = parsed.password
    DB_NAME = parsed.path.lstrip('/')
    DB_PORT = parsed.port or 3306
else:
    # Fallback to individual variables
    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    DB_PORT = int(os.getenv("DB_PORT", 3306))

# Database connection with error handling
def get_db():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=int(DB_PORT),
            autocommit=False
        )
        return conn
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return None

@app.route("/rates", methods=["GET"])
@limiter.limit("100 per hour")
def rates():
    try:
        db = get_db()
        if not db:
            return jsonify({"error": "Database unavailable"}), 503
        
        cur = db.cursor()
        cur.execute("SELECT gold_per_tola, gold_per_gram, silver_per_tola, silver_per_gram FROM rates ORDER BY id DESC LIMIT 1")
        row = cur.fetchone()
        cur.close()
        db.close()
        
        if not row:
            return jsonify({"error": "No rates found"}), 404
        
        return jsonify({
            "gold_per_tola": float(row[0]),
            "gold_per_gram": float(row[1]),
            "silver_per_tola": float(row[2]),
            "silver_per_gram": float(row[3]),
        })
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/admin-login", methods=["POST", "OPTIONS"])
@limiter.limit("5 per minute")
def admin_login():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"error": "Invalid credentials"}), 401

        db = get_db()
        if not db:
            return jsonify({"error": "Database unavailable"}), 503

        cur = db.cursor()
        cur.execute("SELECT password_hash FROM admin_users WHERE username=%s", (username,))
        user = cur.fetchone()
        cur.close()
        db.close()

        if user and check_password_hash(user[0], password):
            token = create_access_token(identity=username)
            return jsonify({"token": token, "status": "success"}), 200
        
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"[ERROR] Login error: {e}")
        return jsonify({"error": "Login failed"}), 500

@app.route("/update-rates", methods=["POST", "OPTIONS"])
@jwt_required()
@limiter.limit("10 per hour")
def update_rates():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        current_user = get_jwt_identity()
        data = request.get_json() or {}
        
        # Validate input
        try:
            gold_tola = float(data.get("gold_tola", 0))
            gold_gram = float(data.get("gold_gram", 0))
            silver_tola = float(data.get("silver_tola", 0))
            silver_gram = float(data.get("silver_gram", 0))
            
            if any(x <= 0 for x in [gold_tola, gold_gram, silver_tola, silver_gram]):
                return jsonify({"error": "All rates must be positive"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid rate values"}), 400
        
        db = get_db()
        if not db:
            return jsonify({"error": "Database unavailable"}), 503

        cur = db.cursor()
        cur.execute("""
            INSERT INTO rates (gold_per_tola, gold_per_gram, silver_per_tola, silver_per_gram)
            VALUES (%s, %s, %s, %s)
        """, (gold_tola, gold_gram, silver_tola, silver_gram))
        db.commit()
        cur.close()
        db.close()
        
        print(f"[INFO] Rates updated by {current_user}")
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "Update failed"}), 500

@app.route("/admin-logout", methods=["POST", "OPTIONS"])
def admin_logout():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        session.clear()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "Logout failed"}), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Too many requests. Please try again later."}), 429

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
