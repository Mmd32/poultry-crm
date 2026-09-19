from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/customers/', include('apps.customers.urls')),
    path('api/farms/', include('apps.farms.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/feedbacks/', include('apps.feedbacks.urls')),
    path('api/reminders/', include('apps.reminders.urls')),
    path('api/churn/', include('apps.churn.urls')),
    path('api/offers/', include('apps.offers.urls')),
]
