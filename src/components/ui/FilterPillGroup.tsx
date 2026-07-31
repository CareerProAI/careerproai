import React from 'react';

interface FilterPillGroupProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

export default function FilterPillGroup<T extends string>({ options, value, onChange }: FilterPillGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
            value === option
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
