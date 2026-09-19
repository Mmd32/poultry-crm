from rest_framework import generics, filters
from .models import Customer
from .serializers import CustomerSerializer


class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.select_related('assigned_to')
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'phone', 'city']
    ordering_fields = ['created_at', 'name', 'risk_level']

    def get_queryset(self):
        qs = super().get_queryset()
        risk = self.request.query_params.get('risk_level')
        if risk:
            qs = qs.filter(risk_level=risk)
        return qs


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.select_related('assigned_to')
    serializer_class = CustomerSerializer
