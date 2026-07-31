import React from 'react';

interface SideNavItemProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so passing
  // key={item.id} at the call site type-checks.
  key?: string;
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

export default function SideNavItem({ id, label, icon, isActive, onClick }: SideNavItemProps) {
  return (
    <button
      id={`nav-${id}`}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-full px-4 py-3 mx-2 text-left transition-all ${
        isActive
          ? 'bg-secondary-container text-on-secondary-container font-semibold scale-[0.98]'
          : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
