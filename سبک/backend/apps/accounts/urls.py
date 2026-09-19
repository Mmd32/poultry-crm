from django.urls import path
from .views import MeView, UserListCreateView

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('users/', UserListCreateView.as_view(), name='users'),
]
