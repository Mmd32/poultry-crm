from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    farm_name = serializers.CharField(source='farm.name', read_only=True)
    feedback_type_display = serializers.CharField(source='get_feedback_type_display', read_only=True)
    will_repurchase_display = serializers.CharField(source='get_will_repurchase_display', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
