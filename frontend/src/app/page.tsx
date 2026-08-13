'use client';

import React, { useState } from 'react';
import Server3DView from '@/components/Server3DView';
import MermaidDiagram from '@/components/MermaidDiagram';

interface HardwareItem {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
}

interface AnalysisResult {
  hardware?: HardwareItem[];
  security?: string[];
  mermaid_code?: string;
  location_analysis?: {
    country?: string;
    city?: string;
    isp_tower?: string;
    speed_mbps?: number;
    ping_ms?: number;
  };
}

export default function Home() {
  const [formData, setFormData] = useState({
    ip_address: '185.190.140.1',
    company_type: 'شركة تقنية متوسطة',
    employees: 120,
    budget: '$10,000 - $25,000',
    is_sensitive_data: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [locationData, setLocationData] = useState({
    country: 'السعودية (Saudi Arabia)',
    city: 'الرياض (Riyadh)',
    isp_tower: 'STC 5G Tower (0.8 KM)',
    speed_mbps: 950,
    ping_ms: 12,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // استخدام رابط الباك إند بأسلوب مرن لتفادي مشاكل الاتصال
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${BACKEND_URL}/api/consult`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`تعذر الاتصال بالخادم (رمز الخطأ: ${res.status})`);
      }

      const data = await res.json();

      // التعامل مع هيكلية البيانات المختلفة المرجعة من الباك إند
      const resultData = data.analysis || data;

      if (resultData) {
        setAnalysis(resultData);
        if (resultData.location_analysis) {
          setLocationData((prev) => ({
            ...prev,
            country: resultData.location_analysis.country || prev.country,
            city: resultData.location_analysis.city || prev.city,
            isp_tower: resultData.location_analysis.isp_tower || prev.isp_tower,
            speed_mbps: resultData.location_analysis.speed_mbps ?? prev.speed_mbps,
            ping_ms: resultData.location_analysis.ping_ms ?? prev.ping_ms,
          }));
        }
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setErrorMsg(err.message || 'حدث خطأ أثناء التواصل مع سيرفر الاستشارات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans" dir="rtl">
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">منصة استشارات هيكلة السيرفرات والبنية التحتية</h1>
          <p className="text-slate-400 text-sm">Server Infrastructure Architect Consultant AI</p>
        </div>
      </header>

      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-950/80 border border-red-500 text-red-200 p-4 rounded-xl text-sm">
          ⚠️ <strong>تنبيه:</strong> {errorMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* الخانة 1: إدخال البيانات */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-cyan-300 mb-4">📝 الخانة 1: بيانات المنشأة والشبكة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">عنوان IP الخاص بالسيرفر/الشبكة</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">نوع المنشأة</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                value={formData.company_type}
                onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">عدد الأجهزة/المستخدمين</label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">الميزانية التقديرية</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="sensitive"
                checked={formData.is_sensitive_data}
                onChange={(e) => setFormData({ ...formData, is_sensitive_data: e.target.checked })}
                className="w-4 h-4 accent-cyan-500"
              />
              <label htmlFor="sensitive" className="text-xs text-slate-300 cursor-pointer">بيانات حساسة (تتطلب حماية متقدمة)</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-950 disabled:opacity-50"
            >
              {loading ? 'جاري التحليل الهندسي...' : '🚀 بدء التحليل الشامل'}
            </button>
          </form>
        </div>

        {/* الخانة 2: تحليل الموقع والبنية التحتية */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h2 className="text-lg font-bold text-cyan-300">📍 الخانة 2: تحليل الموقع والبنية التحتية</h2>
            <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">تفاعلي</span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs text-slate-400">🌐 الدولة / البلد:</label>
              <input
                type="text"
                className="w-full bg-slate-800/80 border border-slate-700 rounded px-2.5 py-1 text-cyan-300 mt-1"
                value={locationData.country}
                onChange={(e) => setLocationData({ ...locationData, country: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">🏙️ المدينة / الموقع المفترض:</label>
              <input
                type="text"
                className="w-full bg-slate-800/80 border border-slate-700 rounded px-2.5 py-1 text-cyan-300 mt-1"
                value={locationData.city}
                onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">📡 أقرب برج شبكة:</label>
              <input
                type="text"
                className="w-full bg-slate-800/80 border border-slate-700 rounded px-2.5 py-1 text-cyan-300 mt-1"
                value={locationData.isp_tower}
                onChange={(e) => setLocationData({ ...locationData, isp_tower: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400">⚡ السرعة (Mbps):</label>
                <input
                  type="number"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded px-2.5 py-1 text-emerald-400 mt-1"
                  value={locationData.speed_mbps}
                  onChange={(e) => setLocationData({ ...locationData, speed_mbps: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">📶 Ping (ms):</label>
                <input
                  type="number"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded px-2.5 py-1 text-yellow-400 mt-1"
                  value={locationData.ping_ms}
                  onChange={(e) => setLocationData({ ...locationData, ping_ms: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-300 mb-2">🖥️ العرض 3D التفاعلي لكابينة السيرفر:</h3>
            <Server3DView />
          </div>
        </div>

        {/* الخانة 3: المخطط الهيكلي والنتائج */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-cyan-300 border-b border-slate-800 pb-2">🌐 المخطط الهيكلي والتوصية الفنية</h2>

          {analysis ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20">
                <h3 className="font-bold text-cyan-400 mb-2">💻 متطلبات العتاد (Hardware):</h3>
                {analysis.hardware && analysis.hardware.length > 0 ? (
                  <ul className="space-y-1 list-disc list-inside text-slate-300">
                    {analysis.hardware.map((item, idx) => (
                      <li key={idx}><span className="text-white font-semibold">{item.name}:</span> {item.cpu} | {item.ram} | {item.storage}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">لا توجد بيانات عتاد مسجلة.</p>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-emerald-400 mb-2">🔒 إجراءات الأمان والحماية:</h3>
                {analysis.security && analysis.security.length > 0 ? (
                  <ul className="space-y-1 list-disc list-inside text-slate-300">
                    {analysis.security.map((sec, idx) => (
                      <li key={idx}>{sec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">لا توجد توصيات أمان مخصصة.</p>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-yellow-400 mb-2">📐 المخطط الهيكلي (Mermaid Diagram):</h3>
                {analysis.mermaid_code ? (
                  <MermaidDiagram chart={analysis.mermaid_code} />
                ) : (
                  <p className="text-slate-500">لا يوجد مخطط متاح.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              قم بضغط "بدء التحليل الشامل" لعرض المخطط الهيكلي والتوصيات.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}