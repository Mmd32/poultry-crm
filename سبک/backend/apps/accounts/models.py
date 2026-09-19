from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'مدیر'),
        ('sales', 'کارشناس فروش'),
        ('manager', 'مدیر فروش'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='sales', verbose_name='نقش')
    phone = models.CharField(max_length=20, blank=True, verbose_name='تلفن')

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
