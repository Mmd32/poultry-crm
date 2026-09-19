from rest_framework import serializers
from .models import Farm


class FarmSerializer(serializers.ModelSerializer):
    farm_type_display = serializers.CharField(source='get_farm_type_display', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Farm
        fields = '__all__'
