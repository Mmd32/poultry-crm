from django.db import models
from apps.customers.models import Customer


class Farm(models.Model):
    TYPE_CHOICES = [
        ('broiler', 'مرغداری گوشتی'),
        ('breeder', 'مرغداری مادری'),
        ('layer', 'مرغداری تخم‌گذار'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='farms', verbose_name='مشتری')
    name = models.CharField(max_length=200, verbose_name='نام مزرعه')
    farm_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='نوع مزرعه')
    capacity = models.IntegerField(verbose_name='ظرفیت (قطعه)')
    location = models.CharField(max_length=300, blank=True, verbose_name='موقعیت')
    address = models.TextField(blank=True, verbose_name='آدرس دقیق')
    reminder_interval_days = models.IntegerField(default=7, verbose_name='فاصله یادآوری (روز)')
    notes = models.TextField(blank=True, verbose_name='یادداشت')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'مزرعه'
        verbose_name_plural = 'مزارع'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.get_farm_type_display()} ({self.customer.name})"
