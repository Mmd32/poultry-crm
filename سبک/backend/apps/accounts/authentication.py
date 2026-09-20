from rest_framework.authentication import BaseAuthentication

from .models import User

# فقط برای فاز تست: هر درخواست به‌عنوان کاربر admin احراز هویت می‌شود.
# برای برگرداندن لاگین، این کلاس را از DEFAULT_AUTHENTICATION_CLASSES حذف کنید.
DEMO_USERNAME = 'admin'


class DemoAuthentication(BaseAuthentication):
    def authenticate(self, request):
        user = User.objects.filter(username=DEMO_USERNAME).first()
        if user is None:
            return None
        return (user, None)
