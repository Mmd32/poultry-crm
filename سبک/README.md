# CRM مرغداری — Poultry Farm CRM

سیستم مدیریت مشتریان برای شرکت‌های طیور | Django + React RTL

## راه‌اندازی سریع با Docker

```bash
docker-compose up -d
```

سپس superuser بسازید:

```bash
docker-compose exec backend python manage.py createsuperuser
```

- فرانت‌اند: http://localhost:3000
- بک‌اند API: http://localhost:8000/api
- پنل ادمین: http://localhost:8000/admin

---

## راه‌اندازی دستی (بدون Docker)

### بک‌اند

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# ویرایش .env و تنظیم دیتابیس

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Celery (یادآورهای خودکار)

```bash
celery -A config worker -l info
celery -A config beat -l info
```

### فرانت‌اند

```bash
cd frontend
npm install
npm run dev
```

---

## ماژول‌های اصلی

| ماژول | مسیر API |
|---|---|
| احراز هویت | `/api/auth/token/` |
| مشتریان | `/api/customers/` |
| مزارع | `/api/farms/` |
| فروش | `/api/sales/` |
| بازخوردها | `/api/feedbacks/` |
| یادآورها | `/api/reminders/` |
| ریسک‌سنجی | `/api/churn/` |
| پیشنهادات | `/api/offers/` |
| آمار داشبورد | `/api/reminders/stats/dashboard/` |

## نوع‌های مزرعه و جریان یادآور

- **گوشتی**: یادآور بازخورد هفته اول → یادآور خرید → بررسی ریسک
- **مادری**: بازخورد هفته اول → دوره‌ای → پایان دوره → بررسی ریسک
- **تخم‌گذار**: یادآور هفتگی تکرارشونده (قابل تنظیم) + بررسی ریسک مستمر
