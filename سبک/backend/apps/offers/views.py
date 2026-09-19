from rest_framework import generics, filters
from .models import RetentionOffer
from .serializers import RetentionOfferSerializer


class OfferListCreateView(generics.ListCreateAPIView):
    queryset = RetentionOffer.objects.select_related('customer', 'created_by')
    serializer_class = RetentionOfferSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class OfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RetentionOffer.objects.select_related('customer')
    serializer_class = RetentionOfferSerializer
