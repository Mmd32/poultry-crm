from django.contrib import admin
from .models import RetentionOffer

@admin.register(RetentionOffer)
class RetentionOfferAdmin(admin.ModelAdmin):
    list_display = ['customer', 'offer_type', 'title', 'status', 'created_at']
    list_filter = ['offer_type', 'status']
    search_fields = ['customer__name', 'title']
