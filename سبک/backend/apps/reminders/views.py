from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Reminder
from .serializers import ReminderSerializer


class ReminderListCreateView(generics.ListCreateAPIView):
    queryset = Reminder.objects.select_related('customer', 'farm', 'assigned_to')
    serializer_class = ReminderSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['due_date', 'status']

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        today = self.request.query_params.get('today')
        if today:
            from datetime import date
            qs = qs.filter(due_date=date.today())
        return qs


class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reminder.objects.select_related('customer', 'farm')
    serializer_class = ReminderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_done(request, pk):
    try:
        reminder = Reminder.objects.get(pk=pk)
        reminder.status = 'done'
        reminder.completed_at = timezone.now()
        reminder.save()
        return Response({'status': 'done'})
    except Reminder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    from datetime import date
    from apps.customers.models import Customer

    today = date.today()
    return Response({
        'total_customers': Customer.objects.filter(is_active=True).count(),
        'today_reminders': Reminder.objects.filter(due_date=today, status='pending').count(),
        'overdue_reminders': Reminder.objects.filter(status='overdue').count(),
        'urgent_reminders': Reminder.objects.filter(status='urgent').count(),
        'high_risk_customers': Customer.objects.filter(risk_level='high', is_active=True).count(),
        'medium_risk_customers': Customer.objects.filter(risk_level='medium', is_active=True).count(),
    })
