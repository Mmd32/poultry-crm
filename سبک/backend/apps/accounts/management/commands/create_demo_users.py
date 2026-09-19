from django.core.management.base import BaseCommand
from apps.accounts.models import User


class Command(BaseCommand):
    help = 'Create demo users for testing (idempotent)'

    def handle(self, *args, **kwargs):
        users = [
            {
                'username': 'admin',
                'password': 'Morgh@1404',
                'first_name': 'مدیر',
                'last_name': 'سیستم',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'sales1',
                'password': 'Morgh@1404',
                'first_name': 'کارشناس',
                'last_name': 'فروش',
                'role': 'sales',
                'is_staff': False,
                'is_superuser': False,
            },
        ]

        for u in users:
            obj, created = User.objects.get_or_create(username=u['username'])
            obj.set_password(u['password'])
            obj.first_name = u['first_name']
            obj.last_name = u['last_name']
            obj.role = u['role']
            obj.is_staff = u['is_staff']
            obj.is_superuser = u['is_superuser']
            obj.save()
            status = 'ساخته شد' if created else 'آپدیت شد'
            self.stdout.write(f'  {u["username"]} → {status}')

        self.stdout.write(self.style.SUCCESS('کاربران demo آماده‌اند.'))
