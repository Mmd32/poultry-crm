from rest_framework import generics, filters
from .models import ChurnAssessment
from .serializers import ChurnAssessmentSerializer


class ChurnAssessmentListCreateView(generics.ListCreateAPIView):
    queryset = ChurnAssessment.objects.select_related('customer', 'assessed_by')
    serializer_class = ChurnAssessmentSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['assessed_at', 'score']

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        risk = self.request.query_params.get('risk')
        if risk:
            qs = qs.filter(risk_level=risk)
        return qs

    def perform_create(self, serializer):
        serializer.save(assessed_by=self.request.user)


class ChurnAssessmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChurnAssessment.objects.select_related('customer')
    serializer_class = ChurnAssessmentSerializer
