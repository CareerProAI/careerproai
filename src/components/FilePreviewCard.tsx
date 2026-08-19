import React from 'react';

interface FilePreviewCardProps {
  file: File;
  onRemove: () => void;
  onAnalyze: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePreviewCard({ file, onRemove, onAnalyze }: FilePreviewCardProps) {
  return (
    <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-outline-variant/60 min-h-[340px]">
      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-primary">description</span>
      </div>
      <h3 className="text-sm font-bold text-on-surface mb-1 break-all max-w-full px-4">{file.name}</h3>
      <p className="text-xs text-on-surface-variant mb-6">{formatFileSize(file.size)}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRemove}
          className="px-5 py-2.5 min-h-11 border border-outline-variant text-on-surface font-bold rounded-xl text-xs hover:bg-surface-container transition-colors touch-manipulation"
        >
          Remove
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          className="px-5 py-2.5 min-h-11 bg-primary text-on-primary font-bold rounded-xl text-xs shadow-md hover:bg-primary/95 transition-all touch-manipulation"
        >
          Analyze CV
        </button>
      </div>
    </div>
  );
}
