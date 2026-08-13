'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

// تحصين نصوص العقد اللي فيها أقواس أو رموز خاصة قبل ما توصل لمحرك Mermaid
function sanitizeMermaidCode(code: string): string {
  return code.replace(/(\w+)\[([^\[\]"]*)\]/g, (match, id, label) => {
    const needsQuoting = /[()#{}|]/.test(label);
    if (needsQuoting) {
      const cleanLabel = label.replace(/"/g, "'");
      return `${id}["${cleanLabel}"]`;
    }
    return match;
  });
}

const MermaidDiagram: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    });

    if (containerRef.current && chart) {
      setError(null);
      const safeChart = sanitizeMermaidCode(chart);
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      mermaid.render(id, safeChart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch((err) => {
        console.error('Mermaid Render Error:', err);
        setError('تعذر عرض المخطط الهيكلي — صيغة الكود المُولّد غير صالحة.');
      });
    }
  }, [chart]);

  return (
    <div className="w-full overflow-x-auto bg-slate-900 p-4 rounded-xl border border-cyan-500/20 my-4 flex justify-center">
      {error ? (
        <div className="text-red-400 text-xs p-3 bg-red-950/30 border border-red-800 rounded-lg w-full text-center">
          ⚠️ {error}
        </div>
      ) : (
        <div ref={containerRef} className="w-full min-w-[600px]" />
      )}
    </div>
  );
};

export default MermaidDiagram;