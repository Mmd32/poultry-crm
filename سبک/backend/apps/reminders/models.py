from django.db import models
from apps.customers.models import Customer
from apps.farms.models import Farm
from apps.accounts.models import User


class Reminder(models.Model):
    TYPE_CHOICES = [
        ('feedback', 'بازخورد'),
        ('purchase', 'یادآور خرید'),
        ('followup', 'پیگیری'),
        ('churn_alert', 'هشدار ریسک'),
    ]
    STATUS_CHOICES = [
        ('pending', 'انجام نشده'),
        ('done', 'انجام شد'),
        ('overdue', 'عقب‌افتاده'),
        ('urgent', 'نیاز به پیگیری فوری'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reminders', verbose_name='مشتری')
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='reminders', verbose_name='مزرعه')
    sale = models.ForeignKey(
        'sales.Sale', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reminders', verbose_name='فروش مرتبط'
    )
    title = models.CharField(max_length=300, verbose_name='عنوان')
    reminder_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='نوع یادآور')
    due_date = models.DateField(verbose_name='تاریخ سررسید')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reminders', verbose_name='مسئول'
    )
    notes = models.TextField(blank=True, verbose_name='یادداشت')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ انجام')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'یادآور'
        verbose_name_plural = 'یادآورها'
        ordering = ['due_date', 'status']

    def __str__(self):
        return f"{self.title} — {self.customer.name} — {self.due_date}"
