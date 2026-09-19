from rest_framework import serializers
from .models import RetentionOffer


class RetentionOfferSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    offer_type_display = serializers.CharField(source='get_offer_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = RetentionOffer
        fields = '__all__'
