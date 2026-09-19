from rest_framework import generics, filters
from .models import Sale
from .serializers import SaleSerializer


class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.select_related('farm', 'farm__customer')
    serializer_class = SaleSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sale_date', 'total_price']

    def get_queryset(self):
        qs = super().get_queryset()
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            qs = qs.filter(farm_id=farm_id)
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(farm__customer_id=customer_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)


class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.select_related('farm', 'farm__customer')
    serializer_class = SaleSerializer
