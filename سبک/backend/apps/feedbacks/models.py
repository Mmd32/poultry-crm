from django.db import models
from apps.sales.models import Sale
from apps.customers.models import Customer
from apps.farms.models import Farm


class Feedback(models.Model):
    FEEDBACK_TYPE_CHOICES = [
        ('week1', 'هفته اول'),
        ('periodic', 'دوره‌ای'),
        ('end_cycle', 'پایان دوره'),
        ('complaint', 'شکایت'),
        ('general', 'عمومی'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='feedbacks', verbose_name='مشتری')
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='feedbacks', verbose_name='مزرعه')
    sale = models.ForeignKey(Sale, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks', verbose_name='فروش مرتبط')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPE_CHOICES, default='general', verbose_name='نوع بازخورد')
    satisfaction = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        verbose_name='رضایت (۱-۵)'
    )
    has_complaint = models.BooleanField(default=False, verbose_name='شکایت دارد')
    complaint_text = models.TextField(blank=True, verbose_name='متن شکایت')
    mortality_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='نرخ تلفات (%)')
    production_note = models.TextField(blank=True, verbose_name='یادداشت تولید')
    will_repurchase = models.CharField(
        max_length=10,
        choices=[('yes', 'بله'), ('maybe', 'شاید'), ('no', 'خیر'), ('unknown', 'مشخص نیست')],
        default='unknown',
        verbose_name='قصد خرید مجدد'
    )
    recorded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, verbose_name='یادداشت')

    class Meta:
        verbose_name = 'بازخورد'
        verbose_name_plural = 'بازخوردها'
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.customer.name} — {self.get_feedback_type_display()} — رضایت: {self.satisfaction}"
