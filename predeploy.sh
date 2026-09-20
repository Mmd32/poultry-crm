#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/سبک/backend"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py create_demo_users
