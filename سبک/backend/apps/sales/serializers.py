from rest_framework import serializers
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.name', read_only=True)
    customer_name = serializers.CharField(source='farm.customer.name', read_only=True)
    farm_type = serializers.CharField(source='farm.farm_type', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
