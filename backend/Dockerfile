FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install "bcrypt==3.2.2" passlib==1.7.4 email-validator==2.3.0

COPY . .

# Wait for DB, run migrations, seed, then start uvicorn
CMD sleep 5 && alembic upgrade head && python seed.py || true && uvicorn app.main:app --host 0.0.0.0 --port 8001
