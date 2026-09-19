from rest_framework import serializers
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    farm_name = serializers.CharField(source='farm.name', read_only=True)
    farm_type = serializers.CharField(source='farm.farm_type', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reminder_type_display = serializers.CharField(source='get_reminder_type_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Reminder
        fields = '__all__'

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None

    def get_is_overdue(self, obj):
        from datetime import date
        return obj.due_date < date.today() and obj.status == 'pending'
