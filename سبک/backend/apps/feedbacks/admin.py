from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['customer', 'farm', 'feedback_type', 'satisfaction', 'has_complaint', 'will_repurchase', 'recorded_at']
    list_filter = ['feedback_type', 'has_complaint', 'will_repurchase', 'satisfaction']
    search_fields = ['customer__name', 'farm__name']
