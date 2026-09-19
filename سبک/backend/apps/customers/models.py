from django.db import models
from apps.accounts.models import User


class Customer(models.Model):
    RISK_CHOICES = [
        ('low', 'کم‌ریسک'),
        ('medium', 'ریسک متوسط'),
        ('high', 'پرریسک'),
    ]

    name = models.CharField(max_length=200, verbose_name='نام')
    phone = models.CharField(max_length=20, verbose_name='تلفن')
    phone2 = models.CharField(max_length=20, blank=True, verbose_name='تلفن دوم')
    city = models.CharField(max_length=100, verbose_name='شهر')
    province = models.CharField(max_length=100, blank=True, verbose_name='استان')
    address = models.TextField(blank=True, verbose_name='آدرس')
    notes = models.TextField(blank=True, verbose_name='یادداشت')
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, default='low', verbose_name='سطح ریسک')
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='customers', verbose_name='کارشناس فروش'
    )
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'مشتری'
        verbose_name_plural = 'مشتریان'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.city}"
