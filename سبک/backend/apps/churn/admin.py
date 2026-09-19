from django.contrib import admin
from .models import ChurnAssessment

@admin.register(ChurnAssessment)
class ChurnAssessmentAdmin(admin.ModelAdmin):
    list_display = ['customer', 'risk_level', 'score', 'trigger', 'has_complaint', 'assessed_at']
    list_filter = ['risk_level', 'trigger', 'has_complaint']
    search_fields = ['customer__name']
