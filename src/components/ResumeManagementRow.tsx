import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeManagementRowProps {
  key?: string;
  profile: ResumeProfile;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function ResumeManagementRow({
  profile,
  isActive,
  onSelect,
  onDelete,
}: ResumeManagementRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
        isActive ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/30'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-on-surface truncate">{profile.fileName}</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">
          {profile.candidateName} • {profile.score}/100 • {profile.lastAnalyzed}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isActive && (
          <button onClick={onSelect} className="text-[10px] font-bold text-primary hover:underline">
            Set Active
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
          title={`Delete ${profile.fileName}`}
          aria-label={`Delete ${profile.fileName}`}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">delete</span>
        </button>
      </div>
    </div>
  );
}
