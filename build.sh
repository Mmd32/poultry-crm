#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/سبک/backend"
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py create_demo_users
