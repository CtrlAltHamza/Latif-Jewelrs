FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Run setup script on container start (only creates if tables don't exist)
RUN echo "Database setup will run at startup"

CMD python scripts/railway_setup.py && gunicorn app:app --bind 0.0.0.0:8000