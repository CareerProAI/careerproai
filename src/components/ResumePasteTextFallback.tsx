import React from 'react';

interface ResumePasteTextFallbackProps {
  uploadText: string;
  setUploadText: (text: string) => void;
  onSubmit: (file: File) => void;
  triggerToast: (msg: string) => void;
}

export default function ResumePasteTextFallback({ uploadText, setUploadText, onSubmit, triggerToast }: ResumePasteTextFallbackProps) {
  return (
    <div className="mt-8 w-full max-w-md pt-6 border-t border-outline-variant/40">
      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Or parse typed resume details</p>
      <textarea
        placeholder="Paste candidate info or resume text here (e.g. John Mercer - Lead Developer...)"
        value={uploadText}
        onChange={(e) => setUploadText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-16 text-xs bg-surface-container-low dark:bg-slate-950 border border-outline-variant/60 rounded-xl px-3 py-2 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 resize-none"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!uploadText) {
            triggerToast('Please type or paste some resume text first!');
            return;
          }
          onSubmit(new File([uploadText], 'pasted_resume_input.txt', { type: 'text/plain' }));
        }}
        type="button"
        className="mt-2 w-full min-h-11 text-center text-xs text-primary font-bold hover:underline touch-manipulation"
      >
        Parse Typed Text
      </button>
    </div>
  );
}
