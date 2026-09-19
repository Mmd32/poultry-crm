from django.db import models
from apps.customers.models import Customer
from apps.accounts.models import User


class RetentionOffer(models.Model):
    OFFER_TYPE_CHOICES = [
        ('discount', 'تخفیف قیمت'),
        ('payment_terms', 'شرایط بهتر پرداخت'),
        ('priority_supply', 'اولویت عرضه'),
        ('quality_guarantee', 'تضمین کیفیت'),
        ('replacement_guarantee', 'تضمین جایگزینی'),
        ('custom', 'سفارشی'),
    ]
    STATUS_CHOICES = [
        ('draft', 'پیش‌نویس'),
        ('sent', 'ارسال شده'),
        ('accepted', 'پذیرفته شده'),
        ('rejected', 'رد شده'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='offers', verbose_name='مشتری')
    offer_type = models.CharField(max_length=30, choices=OFFER_TYPE_CHOICES, verbose_name='نوع پیشنهاد')
    title = models.CharField(max_length=300, verbose_name='عنوان پیشنهاد')
    details = models.TextField(verbose_name='جزئیات')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name='وضعیت')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='ایجادکننده')
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ ارسال')
    response_at = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ پاسخ')
    customer_response = models.TextField(blank=True, verbose_name='پاسخ مشتری')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'پیشنهاد حفظ مشتری'
        verbose_name_plural = 'پیشنهادات حفظ مشتری'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer.name} — {self.get_offer_type_display()} — {self.get_status_display()}"
