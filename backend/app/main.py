import json
import re
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.services.location_service import get_ip_location_data
from app.services.network_scanner import scan_common_ports

app = FastAPI(title="Server Infrastructure Architect Consultant AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConsultRequest(BaseModel):
    ip_address: str
    company_type: str
    employees: int
    budget: str
    is_sensitive_data: bool = False
    model_choice: Optional[str] = "llama3.1:8b"  # أو "qwen2.5-coder:7b"

def generate_dynamic_mermaid(data: ConsultRequest) -> str:
    """توليد رسم بياني ديناميكي حسب معطيات المستخدم المحددة"""
    is_large = data.employees > 200
    is_sensitive = data.is_sensitive_data

    # تحديد طبقة الأمان والـ Perimeter
    sec_layer = """
        subgraph Perimeter [منطقة الحماية المتقدمة]
            WAF[Enterprise WAF / DDoS Protection]
            FW[Dual Hardware Firewall Class-A]
        end
    """ if is_sensitive else """
        subgraph Perimeter [منطقة الحماية الأساسية]
            FW[Cloud Firewall / Router FW]
        end
    """

    # تحديد طبقة التطبيقات (Cluster vs Single)
    app_layer = f"""
        subgraph App_Tier [طبقة التطبيقات - {data.company_type}]
            App1[Primary App Server ({data.employees} Users)]
            App2[Secondary Load-Balanced Node]
            LB[HA Proxy / Load Balancer]
        end
    """ if is_large else f"""
        subgraph App_Tier [طبقة التطبيقات - {data.company_type}]
            App1[Main App Server ({data.employees} Users)]
        end
    """

    return f"""graph TD
    Client[المستخدمون / الأجهزة - {data.employees}] --> Perimeter
    {sec_layer}
    Perimeter --> App_Tier
    
    subgraph Data_Tier [طبقة البيانات والتخزين]
        DB[(Primary Database Server)]
        Backup[(Encrypted Offsite Backup)]
    end
    
    App_Tier --> DB
    DB -. Replication .-> Backup
    """

def clean_json_response(raw_text: str) -> dict:
    """استخراج كائن الـ JSON بنجاح حتى لو وضع النموذج نصوصاً قبل أو بعد الكود"""
    if not raw_text:
        return {}
    
    # 1. إزالة وسوم Markdown المعتادة
    cleaned = re.sub(r'```json\s*', '', raw_text, flags=re.IGNORECASE)
    cleaned = re.sub(r'```\s*', '', cleaned).strip()
    
    # 2. المحاولة المباشرة للتفكيك
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # 3. استخراج أول كائن JSON كامل محاط بـ { ... }
    match = re.search(r'\{.*\}', cleaned, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass

    return {}

@app.get("/")
def read_root():
    return {"message": "Server Infrastructure Architect Consultant API is Running"}

@app.post("/api/consult")
async def get_consultation(data: ConsultRequest):
    location_info = get_ip_location_data(data.ip_address)
    network_scan_info = scan_common_ports(data.ip_address)
    sensitive_str = "نعم (تتطلب طبقة DMZ، تشفير صارم، و Hardware Firewall)" if data.is_sensitive_data else "لا"

    # تحديد الموديل المستهدف (افتراضياً llama3.1:8b أو qwen2.5-coder:7b)
    target_model = data.model_choice if data.model_choice else "llama3.1:8b"

    system_prompt = f"""
    أنت مهندس استشاري خبير في البنية التحتية والسيرفرات (Server Infrastructure Architect).
    قم بتحليل البيانات التالية للمنشأة وقدم توصية هندسية مخصصة ودقيقة جداً تناسب الميزانية وعدد الموظفين المعينين فقط.

    بيانات المنشأة والشبكة:
    - عنوان IP: {data.ip_address}
    - الدولة والمدينة: {location_info.get('country', 'Unknown')} - {location_info.get('city', 'Unknown')}
    - عدد المستخدمين/الموظفين: {data.employees}
    - نوع المنشأة: {data.company_type}
    - الميزانية المحددة: {data.budget}
    - بيانات حساسة: {sensitive_str}

    هام جداً: يجب أن تكون مواصفات العتاد (CPU, RAM, Storage) والحلول الأمنية مناسبة حصراً للميزانية ({data.budget}) وحجم المنشأة ({data.company_type} - {data.employees} موظف).

    أرجع ردك كـ JSON فقط بالصيغة التالية دون إضافة أي كلام قبل أو بعد الكائن:
    {{
      "hardware": [
        {{"name": "اسم السيرفر الموصى به", "cpu": "المواصفات", "ram": "المواصفات", "storage": "المواصفات"}}
      ],
      "security": [
        "إجراء أمني متوافق 1",
        "إجراء أمني متوافق 2"
      ],
      "maintenance_schedule": [
        "إجراء صيانة مجدول 1",
        "إجراء صيانة مجدول 2"
      ]
    }}
    """

    parsed_json = {}

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": target_model,
                "prompt": system_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3
                }
            },
            timeout=120
        )
        
        raw_response = response.json().get("response", "")
        parsed_json = clean_json_response(raw_response)

    except Exception as e:
        print(f"Ollama Request Error ({target_model}): {e}")

    # Fallback ديناميكي يتكيف مع معطيات المنشأة في حال حدوث خطأ شبكة
    if not parsed_json or "hardware" not in parsed_json:
        cpu_spec = "32 vCPU" if data.employees > 300 else ("16 vCPU" if data.employees > 100 else "8 vCPU")
        ram_spec = "128 GB" if data.employees > 300 else ("64 GB" if data.employees > 100 else "32 GB")
        
        parsed_json = {
            "hardware": [
                {"name": f"Main Server ({data.company_type})", "cpu": cpu_spec, "ram": ram_spec, "storage": "1 TB NVMe SSD"},
                {"name": "Database Cluster Node", "cpu": cpu_spec, "ram": ram_spec, "storage": "2 TB Enterprise SSD"}
            ],
            "security": [
                f"تأمين شبكي مخصص لعدد {data.employees} موظف",
                "تفعيل الحماية الجدارية وتشفير الاتصالات SSL/TLS"
            ],
            "maintenance_schedule": ["نسخ احتياطي مجدول", "تحديثات أمنية دورية"]
        }

    # إضافة المخرجات التحليلية والمخطط الديناميكي
    parsed_json["location_analysis"] = location_info
    parsed_json["network_scan"] = network_scan_info
    parsed_json["mermaid_code"] = generate_dynamic_mermaid(data)

    return {"status": "success", "analysis": parsed_json}