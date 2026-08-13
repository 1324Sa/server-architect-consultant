import json
import requests
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.services.location_service import get_ip_location_data
from app.services.network_scanner import scan_common_ports
from app.config import settings

router = APIRouter()

class ConsultRequest(BaseModel):
    ip_address: str = Field(..., example="185.190.140.1")
    company_type: str = Field(..., example="شركة تقنية متوسطة")
    employees: int = Field(..., example=120)
    budget: str = Field(..., example="$10,000 - $25,000")
    is_sensitive_data: bool = False

class HardwareItem(BaseModel):
    name: str
    cpu: str
    ram: str
    storage: str

class ConsultResponse(BaseModel):
    hardware: List[HardwareItem]
    security: List[str]
    maintenance_schedule: List[str]
    location_analysis: Dict[str, Any]
    network_scan: Dict[str, Any]
    mermaid_code: str
    estimated_cost_usd: int

def get_default_mermaid_diagram() -> str:
    return """graph TD
    subgraph External_Zone [الشبكة الخارجية والعملاء]
        Client[Internet Users / Remote Clients]
        Admin[IT Security Admin (VPN)]
    end

    subgraph Security_Perimeter [منطقة الحماية والأمان الأولية]
        WAF[Web Application Firewall]
        DDoS[Anti-DDoS Shield]
        EdgeRouter[Core Edge Router]
    end

    subgraph DMZ_Zone [منطقة DMZ المعزولة]
        LB[HA Proxy / Load Balancer Cluster]
        VPN_Gateway[IPsec VPN Gateway]
    end

    subgraph Internal_Network [الشبكة الداخلية المشفرة]
        InternalFW[Internal Hardware Firewall]
        
        subgraph App_Tier [طبقة التطبيقات والخدمات]
            App1[Primary App Server - Node 1]
            App2[Secondary App Server - Node 2]
            Redis[Redis Cache Cluster]
        end
        
        subgraph Data_Tier [طبقة البيانات والتخزين]
            DB_Master[(Primary DB Server - PostgreSQL)]
            DB_Slave[(Replica DB Server - Hot Standby)]
            NAS[(SAN/NAS Enterprise Storage)]
        end

        subgraph Management [الترصد والنسخ الاحتياطي]
            SIEM[SIEM & SOC Logging Server]
            Backup[Automated Offsite Backup Engine]
        end
    end

    Client --> WAF
    WAF --> DDoS
    DDoS --> EdgeRouter
    EdgeRouter --> LB
    Admin --> VPN_Gateway
    VPN_Gateway --> InternalFW
    LB --> InternalFW
    InternalFW --> App1
    InternalFW --> App2
    App1 --> Redis
    App2 --> Redis
    App1 --> DB_Master
    App2 --> DB_Master
    DB_Master -. Replicate .-> DB_Slave
    DB_Master --> NAS
    App1 --> SIEM
    DB_Master --> Backup
"""

@router.post("/consult", response_model=Dict[str, Any])
async def create_infrastructure_consultation(request: ConsultRequest):
    # 1. تحليل عنوان الـ IP والموقع الجغرافي
    location_info = get_ip_location_data(request.ip_address)
    
    # 2. فحص المنافذ والشبكة
    network_scan_info = scan_common_ports(request.ip_address)
    
    sensitive_str = "نعم (تتطلب طبقة DMZ وجدار ناري مادي)" if request.is_sensitive_data else "لا"

    # 3. إعداد المطالبة للنموذج
    system_prompt = f"""
    بصفتك مهندس استشاري خبير في البنية التحتية والسيرفرات:
    قم بتحليل بيانات المنشأة التالية وقدم توصية هندسية بصيغة JSON حصرية:
    - IP: {request.ip_address}
    - الموقع: {location_info.get('country')} - {location_info.get('city')}
    - عدد الموظفين: {request.employees}
    - نوع المنشأة: {request.company_type}
    - الميزانية: {request.budget}
    - بيانات حساسة: {sensitive_str}

    المطلوب رد JSON فقط بالهيكل التالي:
    {{
      "hardware": [
        {{"name": "Server Name", "cpu": "CPU details", "ram": "RAM details", "storage": "Storage details"}}
      ],
      "security": ["توصية 1", "توصية 2"],
      "maintenance_schedule": ["جدول 1", "جدول 2"]
    }}
    """

    # 4. الاتصال مع محرك الذكاء الاصطناعي Ollama
    try:
        response = requests.post(
            f"{settings.OLLAMA_BASE_URL}/api/generate",
            json={
                "model": settings.OLLAMA_MODEL,
                "prompt": system_prompt,
                "stream": False,
                "format": "json"
            },
            timeout=30
        )
        if response.status_code == 200:
            parsed_json = json.loads(response.json().get("response", "{}"))
        else:
            raise Exception("Ollama service returned non-200 status")
    except Exception as e:
        # خيار احتياطي في حال تأخر أو تعثر الذكاء الاصطناعي
        parsed_json = {
            "hardware": [
                {"name": "Enterprise Application Server", "cpu": "16 vCPU", "ram": "64 GB", "storage": "1 TB NVMe SSD"},
                {"name": "High Availability DB Cluster", "cpu": "32 vCPU", "ram": "128 GB", "storage": "2 TB Enterprise SSD"},
                {"name": "Next-Gen Hardware Firewall", "cpu": "8 vCPU", "ram": "16 GB", "storage": "500 GB SSD"}
            ],
            "security": [
                "تفعيل طبقة DMZ معزولة للخدمات العامة",
                "تشفير الاتصالات باستخدام SSL/TLS 1.3",
                "تفعيل الحماية المتقدمة من هجمات DDoS"
            ],
            "maintenance_schedule": [
                "أخذ أخذ لقطات سريعة (Snapshots) يومية وآلية",
                "تحديث ثغرات الأمان والنظام أسبوعياً"
            ]
        }

    # دمج البيانات كاملة
    parsed_json["location_analysis"] = location_info
    parsed_json["network_scan"] = network_scan_info
    parsed_json["mermaid_code"] = get_default_mermaid_diagram()
    parsed_json["estimated_cost_usd"] = 4500

    return {"status": "success", "analysis": parsed_json}