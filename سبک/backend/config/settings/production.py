from .base import *  # noqa

DEBUG = config('DEBUG', default=False, cast=bool)

# Railway (و اکثر PaaS ها) پشت یه پروکسی TLS هستن
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
