import React from 'react';

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
      <span aria-hidden="true" className="material-symbols-outlined text-tertiary-fixed-dim">check_circle</span>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
