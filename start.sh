#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/سبک/backend"
exec gunicorn config.wsgi --bind "0.0.0.0:${PORT:-8000}"
