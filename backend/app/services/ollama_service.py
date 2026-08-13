import ollama
import json

class OllamaArchitectService:
    def __init__(self, model_name: str = "qwen2.5-coder:7b"):
        self.model = model_name

    def generate_infrastructure_plan(self, company_type: str, employees: int, budget: str, open_ports: list):
        prompt = f"""
        بصفتك مهندس استشارات هيكلة سيرفرات (Server Infrastructure Architect):
        قم بتحليل البيانات التالية وقدم توصية هندسية كاملة:
        - نوع الشركة: {company_type}
        - عدد الموظفين: {employees}
        - الميزانية: {budget}
        - المنافذ المفتوحة الحالية: {open_ports}

        المطلوب:
        1. قائمة المعدات والأجهزة المطلوبة بالتفصيل (CPU, RAM, Storage).
        2. المنافذ الواجب فتحها والمنافذ الواجب إغلاقها للأمان.
        3. توصيات الأمان والجدران النارية.
        4. كود Mermaid.js لرسم مخطط هيكلي للشبكة والسيرفرات (Graph TD).

        قم بإرجاع النتيجة بصيغة JSON حصرية بالهيكل التالي:
        {{
            "hardware": [],
            "ports_recommendation": {{ "open": [], "close": [] }},
            "security": [],
            "mermaid_code": "graph TD; ..."
        }}
        """

        response = ollama.chat(
            model=self.model,
            messages=[{'role': 'user', 'content': prompt}],
            format='json'  # إجبار Ollama على إرجاع JSON نظيف
        )

        return json.loads(response['message']['content'])