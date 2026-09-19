from celery import shared_task
from django.utils import timezone
from datetime import date


@shared_task
def mark_overdue_reminders():
    from .models import Reminder
    today = date.today()
    updated = Reminder.objects.filter(
        status='pending',
        due_date__lt=today
    ).update(status='overdue')
    return f"{updated} reminders marked as overdue"


@shared_task
def create_periodic_layer_reminders():
    from .models import Reminder
    from apps.farms.models import Farm
    import datetime

    layer_farms = Farm.objects.filter(farm_type='layer', is_active=True)
    created = 0
    for farm in layer_farms:
        last_reminder = Reminder.objects.filter(
            farm=farm, reminder_type='followup'
        ).order_by('-due_date').first()

        if last_reminder:
            next_due = last_reminder.due_date + datetime.timedelta(days=farm.reminder_interval_days)
            if next_due <= date.today() + datetime.timedelta(days=3):
                Reminder.objects.get_or_create(
                    farm=farm,
                    reminder_type='followup',
                    due_date=next_due,
                    defaults={
                        'customer': farm.customer,
                        'title': f'پیگیری هفتگی — {farm.name}',
                        'status': 'pending',
                    }
                )
                created += 1
    return f"{created} layer farm reminders created"
