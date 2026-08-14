import React from 'react';

interface ApplicationPackagePreviewProps {
  title: string;
  text: string;
  pdfBase64: string;
  fileName: string;
}

function downloadPdf(base64: string, fileName: string) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ApplicationPackagePreview({ title, text, pdfBase64, fileName }: ApplicationPackagePreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">{title}</h4>
        <button
          onClick={() => downloadPdf(pdfBase64, fileName)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-[11px] font-bold hover:bg-primary/90 transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">download</span>
          Download PDF
        </button>
      </div>
      <div className="bg-surface-container-low dark:bg-slate-950/40 rounded-xl p-4 max-h-56 overflow-y-auto">
        <pre className="text-xs text-on-surface-variant whitespace-pre-wrap font-sans leading-relaxed">{text}</pre>
      </div>
    </div>
  );
}
