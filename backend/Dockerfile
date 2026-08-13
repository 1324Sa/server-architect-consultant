# استخدام نسخة بايثون خفيفة ومستقرة
FROM python:3.11-slim

# ضبط متغيرات البيئة لمنع إنشاء ملفات pyc وإخراج السجلات مباشرة
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# تحديد مسار العمل داخل الحاوية
WORKDIR /app

# تثبيت متطلبات النظام والأدوات المساعدة (مثل nmap لمسح الشبكات)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    nmap \
    net-tools \
    curl \
    && rm -rf /var/lib/apt/lists/*

# نسخ ملف المتطلبات أولاً للاستفادة من الـ Caching
COPY requirements.txt /app/requirements.txt

# تثبيت حزم بايثون
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# نسخ كود التطبيق بالكامل إلى الحاوية
COPY . /app

# فتح المنفذ 8000
EXPOSE 8000

# أمر تشغيل FastAPI عبر خادم Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]