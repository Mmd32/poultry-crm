from django.urls import path
from .views import ChurnAssessmentListCreateView, ChurnAssessmentDetailView

urlpatterns = [
    path('', ChurnAssessmentListCreateView.as_view(), name='churn-list'),
    path('<int:pk>/', ChurnAssessmentDetailView.as_view(), name='churn-detail'),
]
