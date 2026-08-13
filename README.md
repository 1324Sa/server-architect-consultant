# 🖥️ Server Infrastructure Architect Consultant
### منصة استشارات وتصميم البنية التحتية للسيرفرات مع الذكاء الاصطناعي والعرض ثلاثي الأبعاد 3D

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Ollama-AI-blue?style=for-the-badge" alt="Ollama" />
  <img src="https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

---

## 📖 نبذة عن المشروع | Overview

**Server Infrastructure Architect Consultant** هي منصة تفاعلية متكاملة لتقديم الاستشارات الفنية والهندسية لبناء وتصميم السيرفرات والبنية التحتية للمنشآت والشركات. 

تدمج المنصة بين **الفحص الميداني الآلي (Automated Reconnaissance)** واستدعاء **نماذج الذكاء الاصطناعي المحلية (Ollama AI)** لتقديم توصيات دقيقة للعتاد (Hardware)، جدران الحماية والأمان (Security)، وإنشاء مخططات هيكلية تفاعلية (Mermaid Topology Diagrams) مع عرض نماذج ثلاثية الأبعاد (3D Visualization).

---

## ✨ المميزات الرئيسية | Key Features

1. **🌐 geo-IP & Network Reconnaissance:** تحليل أوتوماتيكي لعنوان الـ IP المستهدف وتحديد الموقع وتتبع أداء الاتصال (Ping & Bandwidth speed).
2. **🛡️ Port & Security Scanning:** فحص المنافذ المفتوحة والمغلقة واستخراج تقييم أمني مبدئي.
3. **🤖 Local AI Engine Integration:** معالجة البيانات عبر نموذج ذكاء اصطناعي محلي (Ollama) تولّد استجابات هيكلية دقيقة بصيغة JSON.
4. **📊 Dynamic Topology Charting:** توليد رسم بياني تفاعلي لهيكلية الشبكة والسيرفرات باستخدام مكتبة **Mermaid.js**.
5. **🧊 Interactive 3D Server Viewer:** عرض ثلاثي الأبعاد لكابينة السيرفر (Server Rack) والمكونات باستخدام **Three.js / React Three Fiber**.
6. **⚡ Modern Tech Stack:** واجهة مستخدم سريعة وسلسة مبنية بـ **Next.js** وخلفية خفيفة وعالية الأداء بـ **FastAPI**.

---

## 🏗️ معماريّة النظام | Architecture & Workflow
[ Frontend (Next.js 14) ]
│
│  (POST /api/consult)
▼
[ Backend Engine (FastAPI) ]
│
├─► 1. Location & Network Scanner (GeoIP / Port Scan)
├─► 2. Ollama AI Engine (Local LLM System Prompting)
└─► 3. Data Cleaning & Sanitization (Regex & JSON Repair)
│
▼
[ Clean Structured Response (JSON) ]
│
├─► Render Hardware Specs & Security Measures
├─► Render Interactive 3D Server Specs (Three.js)
└─► Render Dynamic Architecture Chart (Mermaid.js)
---

## 🛠️ التقنيات المستخدمة | Tech Stack

### **Frontend (الواجهة الأمامية):**
* **Framework:** Next.js 14 / React 18
* **Styling:** Tailwind CSS / Lucide React Icons
* **3D Rendering:** Three.js / @react-three/fiber
* **Diagrams:** Mermaid.js

### **Backend (الخلفية):**
* **Framework:** Python FastAPI
* **Server:** Uvicorn
* **AI Provider:** Ollama (Local LLM Engine)
* **Libraries:** Requests, PyDantic, CORS Middleware

---

## 🚀 طريقة التشغيل والتثبيت | Getting Started

### **1. المتطلبات الأساسية (Prerequisites):**
* **Node.js** (v18+)
* **Python** (v3.10+)
* **Ollama** مثبت ومُفعل محلياً مع نموذج (مثل `llama3` أو `mistral`).

---

### **2. إعداد وتشغيل الخلفية (Backend Setup):**

```bash
# الانتقال لمجلد الباك اند
cd backend

# إنشاء البيئة الافتراضية
python -m venv venv

# تفعيل البيئة (Linux/macOS)
source venv/bin/activate
# أو على Windows:
# venv\Scripts\activate

# تثبيت الحزم المطلوبة
pip install fastapi uvicorn requests

# تشغيل خادم الباك اند
uvicorn main:app --reload --port 8000
----
├── backend/
│   ├── main.py              # تطبيق FastAPI الرئيسي وإعدادات CORS ومعالجة AI
│   └── requirements.txt     # متطلبات البايثون
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── page.tsx      # الواجهة الرئيسية وتجميع المكونات
    │   ├── components/
    │   │   ├── Server3DView.tsx    # مكون العرض ثلاثي الأبعاد (Three.js)
    │   │   └── MermaidDiagram.tsx  # مكون الرسم البياني (Mermaid)
    └── package.json
----
