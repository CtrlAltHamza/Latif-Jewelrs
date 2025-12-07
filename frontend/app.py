# app.py
import os
from flask import Flask, request, jsonify, session, abort
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Rates
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_wtf import CSRFProtect
from flask_session import Session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from dotenv import load_dotenv
import bleach
from decimal import Decimal

load_dotenv()

def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="/static")

    # Config - set via environment in production
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "change_this_secret")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "mysql+pymysql://latif_app:StrongPasswordHere@localhost/latif_jewels")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # session stored server-side on filesystem (OK for dev; use Redis in prod)
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # consider 'Strict' if possible
    app.config['SESSION_COOKIE_SECURE'] = bool(os.getenv("SESSION_COOKIE_SECURE", "False") == "True")

    # CSP and security headers
    csp = {
        'default-src': ["'self'"],
        'img-src': ["'self'", "data:", "https:"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
    }
    Talisman(app, content_security_policy=csp)

    # extensions
    db.init_app(app)
    bcrypt = Bcrypt(app)
    login_manager = LoginManager()
    login_manager.init_app(app)
    csrf = CSRFProtect(app)
    Session(app)

    # rate limiter
    limiter = Limiter(app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # helper: sanitize strings for XSS
    def clean_input(s: str) -> str:
        if not s:
            return s
        # allow only simple tags if needed; here whitelist none
        return bleach.clean(s, tags=[], attributes={}, protocols=[], strip=True)

    # Public API: get current rates
    @app.route("/api/rates", methods=["GET"])
    @limiter.limit("60/minute")
    def get_rates():
        rates = Rates.query.order_by(Rates.id.desc()).first()
        if not rates:
            return jsonify({"error": "rates not found"}), 404
        return jsonify({
            "gold_per_tola": str(rates.gold_per_tola),
            "gold_per_gram": str(rates.gold_per_gram),
            "silver_per_tola": str(rates.silver_per_tola),
            "silver_per_gram": str(rates.silver_per_gram),
            "updated_at": rates.updated_at.isoformat()
        })

    # Admin login (CSRF-protected form or JSON)
    @app.route("/api/admin/login", methods=["POST"])
    @limiter.limit("10 per minute")
    def admin_login():
        # Accept JSON or form
        data = request.get_json(silent=True) or request.form
        username = clean_input(data.get("username", ""))
        password = data.get("password", "")

        if not username or not password:
            return jsonify({"error": "username and password required"}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({"error": "invalid credentials"}), 401

        login_user(user)  # creates a session cookie
        # Provide CSRF token to client via non-HttpOnly cookie or endpoint; Flask-WTF uses session
        return jsonify({"message": "logged_in", "username": user.username})

    # Admin logout
    @app.route("/api/admin/logout", methods=["POST"])
    @login_required
    def admin_logout():
        logout_user()
        return jsonify({"message": "logged_out"})

    # Update rates — requires login and CSRF token
    @app.route("/api/admin/rates", methods=["PUT"])
    @login_required
    @csrf.exempt  # We'll manually check header token; if you use forms, keep CSRFProtect enabled
    def update_rates():
        # For API clients: expect X-CSRFToken header to match session token (Double Submit)
        header_token = request.headers.get("X-CSRFToken")
        # Flask-WTF stores token in session under 'csrf_token' - validate it
        session_token = session.get("csrf_token")
        if not session_token or header_token != session_token:
            return jsonify({"error": "Invalid CSRF token"}), 403

        data = request.get_json() or {}
        try:
            gpt = Decimal(str(data.get("gold_per_tola")))
            gpg = Decimal(str(data.get("gold_per_gram")))
            spt = Decimal(str(data.get("silver_per_tola")))
            spg = Decimal(str(data.get("silver_per_gram")))
        except Exception:
            return jsonify({"error": "Invalid numeric values"}), 400

        # Input is numeric — no XSS vector here; still store safely
        rates = Rates.query.order_by(Rates.id.desc()).first()
        if not rates:
            rates = Rates(
                gold_per_tola=gpt, gold_per_gram=gpg,
                silver_per_tola=spt, silver_per_gram=spg,
                updated_by=current_user.id
            )
            db.session.add(rates)
        else:
            rates.gold_per_tola = gpt
            rates.gold_per_gram = gpg
            rates.silver_per_tola = spt
            rates.silver_per_gram = spg
            rates.updated_by = current_user.id
        db.session.commit()
        return jsonify({"message": "rates updated"})

    # Endpoint to get a fresh CSRF token for AJAX clients (logged-in)
    @app.route("/api/csrf-token", methods=["GET"])
    @login_required
    def get_csrf_token():
        # Generate a secure token and store it in session
        import secrets
        token = secrets.token_hex(32)
        session['csrf_token'] = token
        # Return token in JSON; client must send back in X-CSRFToken header
        return jsonify({"csrf_token": token})

    # Simple health check
    @app.route("/ping", methods=["GET"])
    def ping():
        return jsonify({"ok": True})

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
