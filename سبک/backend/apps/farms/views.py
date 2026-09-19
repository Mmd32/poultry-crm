from rest_framework import generics, filters
from .models import Farm
from .serializers import FarmSerializer


class FarmListCreateView(generics.ListCreateAPIView):
    queryset = Farm.objects.select_related('customer')
    serializer_class = FarmSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'customer__name', 'farm_type']

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        farm_type = self.request.query_params.get('type')
        if farm_type:
            qs = qs.filter(farm_type=farm_type)
        return qs


class FarmDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Farm.objects.select_related('customer')
    serializer_class = FarmSerializer
