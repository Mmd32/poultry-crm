from django.contrib import admin
from .models import Farm

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ['name', 'customer', 'farm_type', 'capacity', 'is_active', 'created_at']
    list_filter = ['farm_type', 'is_active']
    search_fields = ['name', 'customer__name']
