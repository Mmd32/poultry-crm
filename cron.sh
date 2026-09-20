#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/سبک/backend"
python manage.py shell -c "from apps.reminders.tasks import mark_overdue_reminders; mark_overdue_reminders()"
