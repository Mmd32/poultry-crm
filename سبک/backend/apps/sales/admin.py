from django.contrib import admin
from .models import Sale

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['farm', 'sale_date', 'quantity', 'total_price', 'payment_status']
    list_filter = ['payment_status', 'sale_date']
    search_fields = ['farm__name', 'farm__customer__name']
