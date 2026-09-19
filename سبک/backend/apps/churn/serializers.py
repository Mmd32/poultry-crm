from rest_framework import serializers
from .models import ChurnAssessment


class ChurnAssessmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    risk_level_display = serializers.CharField(source='get_risk_level_display', read_only=True)
    trigger_display = serializers.CharField(source='get_trigger_display', read_only=True)
    response_status_display = serializers.CharField(source='get_response_status_display', read_only=True)
    purchase_trend_display = serializers.CharField(source='get_purchase_trend_display', read_only=True)

    class Meta:
        model = ChurnAssessment
        fields = '__all__'
