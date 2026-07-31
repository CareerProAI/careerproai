import React from 'react';

interface RetryableErrorProps {
  message: string;
  onRetry: () => void;
}

export default function RetryableError({ message, onRetry }: RetryableErrorProps) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center border border-error/30 bg-error/5">
      <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
      <p className="text-sm font-bold text-on-surface">Something went wrong</p>
      <p className="text-xs text-on-surface-variant mt-1 mb-4 max-w-sm mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-error text-on-error font-bold rounded-xl text-xs hover:bg-error/90 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
