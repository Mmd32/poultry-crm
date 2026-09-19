from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['title', 'customer', 'farm', 'reminder_type', 'due_date', 'status', 'assigned_to']
    list_filter = ['status', 'reminder_type', 'due_date']
    search_fields = ['customer__name', 'title']
