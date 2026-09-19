from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'city', 'risk_level', 'assigned_to', 'is_active', 'created_at']
    list_filter = ['risk_level', 'is_active', 'province']
    search_fields = ['name', 'phone', 'city']
