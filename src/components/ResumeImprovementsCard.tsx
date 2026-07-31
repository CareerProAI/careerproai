import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeImprovementsCardProps {
  currentProfile: ResumeProfile;
}

export default function ResumeImprovementsCard({ currentProfile }: ResumeImprovementsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-5 border-b border-outline-variant/30 pb-3">
        <div className="p-2 bg-error/10 rounded-xl text-error">
          <span className="material-symbols-outlined">build</span>
        </div>
        <h3 className="text-sm font-bold text-on-surface">Suggested Improvements</h3>
      </div>
      <ul className="space-y-4 flex-1">
        {currentProfile.improvements.map((imp) => (
          <li
            key={imp.id}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              imp.priority === 'High'
                ? 'bg-error-container/40 dark:bg-error-container/20 border-error-container/60'
                : 'bg-surface-container-high/40 dark:bg-slate-800/40 border-outline-variant/40'
            }`}
          >
            <div className="mt-1 shrink-0">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${imp.priority === 'High' ? 'bg-error' : 'bg-secondary'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-on-surface leading-tight">{imp.title}</h4>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    imp.priority === 'High' ? 'bg-error text-on-error' : 'bg-secondary-container text-on-secondary-container'
                  }`}
                >
                  {imp.priority} Priority
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{imp.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
