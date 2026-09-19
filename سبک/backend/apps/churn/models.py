from django.db import models
from apps.customers.models import Customer
from apps.accounts.models import User


class ChurnAssessment(models.Model):
    RISK_CHOICES = [
        ('low', 'کم‌ریسک'),
        ('medium', 'ریسک متوسط'),
        ('high', 'پرریسک'),
    ]
    TRIGGER_CHOICES = [
        ('sale_created', 'ثبت فروش'),
        ('feedback_low', 'بازخورد منفی'),
        ('no_response', 'عدم پاسخ'),
        ('complaint', 'شکایت'),
        ('purchase_drop', 'کاهش خرید'),
        ('payment_delay', 'تأخیر پرداخت'),
        ('manual', 'دستی'),
        ('end_cycle', 'پایان دوره'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='churn_assessments', verbose_name='مشتری')
    assessed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='ارزیاب')
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, verbose_name='سطح ریسک')
    score = models.IntegerField(default=0, verbose_name='امتیاز ریسک (۰-۱۰۰)')
    trigger = models.CharField(max_length=20, choices=TRIGGER_CHOICES, default='manual', verbose_name='علت بررسی')
    satisfaction_score = models.IntegerField(null=True, blank=True, verbose_name='رضایت')
    has_complaint = models.BooleanField(default=False, verbose_name='شکایت دارد')
    response_status = models.CharField(
        max_length=20,
        choices=[('responsive', 'پاسخ‌گو'), ('delayed', 'تأخیر'), ('no_response', 'بی‌پاسخ')],
        default='responsive',
        verbose_name='وضعیت پاسخ'
    )
    purchase_trend = models.CharField(
        max_length=10,
        choices=[('up', 'صعودی'), ('stable', 'ثابت'), ('down', 'نزولی')],
        default='stable',
        verbose_name='روند خرید'
    )
    notes = models.TextField(blank=True, verbose_name='یادداشت')
    assessed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'ارزیابی ریسک'
        verbose_name_plural = 'ارزیابی‌های ریسک'
        ordering = ['-assessed_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.customer.risk_level = self.risk_level
        self.customer.save(update_fields=['risk_level'])

    def __str__(self):
        return f"{self.customer.name} — {self.get_risk_level_display()} — {self.assessed_at.date()}"
