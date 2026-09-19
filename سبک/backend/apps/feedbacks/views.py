from rest_framework import generics, filters
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.select_related('customer', 'farm', 'sale')
    serializer_class = FeedbackSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['recorded_at', 'satisfaction']

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        return qs


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.select_related('customer', 'farm')
    serializer_class = FeedbackSerializer
