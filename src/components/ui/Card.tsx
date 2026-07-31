import React from 'react';

type CardPadding = 'sm' | 'md' | 'lg' | 'xl';
type CardRounded = 'xl' | '2xl';

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  rounded?: CardRounded;
  as?: 'div' | 'section';
  className?: string;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

// Compact stat tiles use rounded-xl; regular content cards use rounded-2xl —
// a real, recurring distinction in the app, not an arbitrary knob.
const ROUNDED_CLASSES: Record<CardRounded, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export default function Card({ children, padding = 'md', rounded = '2xl', as = 'div', className = '' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={`glass-card ${ROUNDED_CLASSES[rounded]} ${PADDING_CLASSES[padding]} border border-outline-variant/60 shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
