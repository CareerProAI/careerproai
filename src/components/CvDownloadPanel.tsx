import React, { useState } from 'react';

interface Props {
  title: string;
  icon: string;
  text: string;
  pdfBase64: string;
  filename: string;
}

function triggerPdfDownload(base64: string, filename: string) {
  const a = document.createElement('a');
  a.href = `data:application/pdf;base64,${base64}`;
  a.download = filename;
  a.click();
}

export default function CvDownloadPanel({ title, icon, text, pdfBase64, filename }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 flex-1 min-w-0 border border-outline-variant">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h4 className="font-bold text-on-surface text-sm flex-1">{title}</h4>
        <div className="flex gap-2">
          <button onClick={copy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-medium text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={() => triggerPdfDownload(pdfBase64, filename)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[14px]">download</span>PDF
          </button>
        </div>
      </div>
      <pre className="text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-sans border-t border-outline-variant/50 pt-3">
        {text}
      </pre>
    </div>
  );
}
