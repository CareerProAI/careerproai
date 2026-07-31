import React from 'react';

interface MatchMatrixAlignmentProps {
  dynamicAlignment: string;
  isAligning: boolean;
  alignmentError: string | null;
  onRetry: () => void;
}

export default function MatchMatrixAlignment({
  dynamicAlignment,
  isAligning,
  alignmentError,
  onRetry,
}: MatchMatrixAlignmentProps) {
  return (
    <div className="border border-outline-variant/20 rounded-xl p-4 space-y-2 bg-surface-container-low dark:bg-slate-950/20">
      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-primary animate-pulse">auto_awesome</span> Experience Alignment
      </h4>
      {isAligning ? (
        <div className="space-y-2 py-1">
          <div className="h-2.5 bg-outline-variant/40 rounded w-full animate-pulse"></div>
          <div className="h-2.5 bg-outline-variant/40 rounded w-5/6 animate-pulse"></div>
        </div>
      ) : alignmentError ? (
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="text-error">{alignmentError}</p>
          <button
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 bg-error text-on-error font-bold rounded-lg text-[11px] hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant leading-relaxed">{dynamicAlignment}</p>
      )}
    </div>
  );
}
