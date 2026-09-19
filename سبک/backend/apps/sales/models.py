from django.db import models
from apps.farms.models import Farm
from apps.accounts.models import User


class Sale(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='sales', verbose_name='مزرعه')
    sale_date = models.DateField(verbose_name='تاریخ فروش')
    quantity = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='مقدار (کیلوگرم)')
    price_per_unit = models.DecimalField(max_digits=12, decimal_places=0, verbose_name='قیمت واحد (تومان)')
    total_price = models.DecimalField(max_digits=15, decimal_places=0, verbose_name='مبلغ کل (تومان)')
    product_type = models.CharField(max_length=100, blank=True, verbose_name='نوع محصول')
    payment_status = models.CharField(
        max_length=20,
        choices=[('paid', 'پرداخت شده'), ('partial', 'پرداخت جزئی'), ('pending', 'معلق')],
        default='pending',
        verbose_name='وضعیت پرداخت'
    )
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='ثبت‌کننده')
    notes = models.TextField(blank=True, verbose_name='یادداشت')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'فروش'
        verbose_name_plural = 'فروش‌ها'
        ordering = ['-sale_date']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.price_per_unit
        super().save(*args, **kwargs)
        self._create_initial_reminders()

    def _create_initial_reminders(self):
        from apps.reminders.models import Reminder
        import datetime

        farm_type = self.farm.farm_type
        customer = self.farm.customer

        if farm_type == 'broiler':
            Reminder.objects.get_or_create(
                sale=self,
                reminder_type='feedback',
                defaults={
                    'customer': customer,
                    'farm': self.farm,
                    'title': 'بازخورد هفته اول — مرغداری گوشتی',
                    'due_date': self.sale_date + datetime.timedelta(days=7),
                    'status': 'pending',
                }
            )
        elif farm_type == 'breeder':
            Reminder.objects.get_or_create(
                sale=self,
                reminder_type='feedback',
                defaults={
                    'customer': customer,
                    'farm': self.farm,
                    'title': 'بازخورد هفته اول — مرغداری مادری',
                    'due_date': self.sale_date + datetime.timedelta(days=7),
                    'status': 'pending',
                }
            )
        elif farm_type == 'layer':
            Reminder.objects.get_or_create(
                sale=self,
                reminder_type='followup',
                defaults={
                    'customer': customer,
                    'farm': self.farm,
                    'title': 'پیگیری هفتگی — مرغداری تخم‌گذار',
                    'due_date': self.sale_date + datetime.timedelta(days=self.farm.reminder_interval_days),
                    'status': 'pending',
                }
            )

    def __str__(self):
        return f"{self.farm.name} — {self.sale_date} — {self.quantity}kg"
