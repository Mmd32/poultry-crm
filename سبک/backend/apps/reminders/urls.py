from django.urls import path
from .views import ReminderListCreateView, ReminderDetailView, mark_done, dashboard_stats

urlpatterns = [
    path('', ReminderListCreateView.as_view(), name='reminder-list'),
    path('<int:pk>/', ReminderDetailView.as_view(), name='reminder-detail'),
    path('<int:pk>/done/', mark_done, name='reminder-done'),
    path('stats/dashboard/', dashboard_stats, name='dashboard-stats'),
]
