import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeStrengthsCardProps {
  currentProfile: ResumeProfile;
}

export default function ResumeStrengthsCard({ currentProfile }: ResumeStrengthsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-5 border-b border-outline-variant/30 pb-3">
        <div className="p-2 bg-tertiary/10 rounded-xl text-tertiary">
          <span aria-hidden="true" className="material-symbols-outlined">trending_up</span>
        </div>
        <h3 className="text-sm font-bold text-on-surface">Top Strengths</h3>
      </div>
      <ul className="space-y-4 flex-1">
        {currentProfile.strengths.map((s) => (
          <li key={s.id} className="flex items-start gap-3">
            <span aria-hidden="true" className="material-symbols-outlined text-tertiary text-lg shrink-0 mt-0.5">check_circle</span>
            <div>
              <h4 className="text-xs font-bold text-on-surface leading-tight">{s.title}</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
