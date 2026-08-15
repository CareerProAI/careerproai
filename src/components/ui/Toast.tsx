import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

const TOAST_VARIANTS: Record<ToastType, { icon: string; iconClass: string }> = {
  success: { icon: 'check_circle', iconClass: 'text-tertiary-fixed-dim' },
  error: { icon: 'cancel', iconClass: 'text-error' },
  info: { icon: 'info', iconClass: 'text-primary' },
};

interface ToastProps {
  message: string;
  type?: ToastType;
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  const variant = TOAST_VARIANTS[type];
  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-toast-in"
    >
      <span aria-hidden="true" className={`material-symbols-outlined ${variant.iconClass}`}>{variant.icon}</span>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
