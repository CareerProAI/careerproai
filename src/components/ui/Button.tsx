import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Secondary intentionally omits a text color utility — existing usages disagree
// (text-primary in some places, text-on-surface in others), so callers supply
// their own via `className` rather than fighting a baked-in default.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-md hover:bg-primary/95',
  secondary: 'border border-outline-variant hover:bg-surface-container',
  danger: 'bg-error text-on-error hover:bg-error/90',
};

// Named after the four recurring px/py pairings actually used across the app,
// not abstract t-shirt sizes — pick the one matching what you're replacing.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-[11px]',
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-6 py-3 text-xs',
};

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
