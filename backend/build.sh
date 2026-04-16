#!/usr/bin/env bash
# exit on error
set -o errexit

# Navigate to backend directory (needed when called from repo root on Render)
cd "$(dirname "$0")"

pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Seed the database incrementally (if needed)
python seed.py
