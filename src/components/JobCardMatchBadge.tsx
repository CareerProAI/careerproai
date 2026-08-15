import React from 'react';
import { Job } from '../types';

function matchGlow(rate: number, notAiScored: boolean): string {
  if (notAiScored) return '';
  if (rate >= 80) return 'shadow-[0_0_12px_rgba(34,197,94,0.3)]';
  if (rate >= 60) return 'shadow-[0_0_12px_rgba(251,191,36,0.25)]';
  return '';
}

interface JobCardMatchBadgeProps {
  job: Job;
}

export default function JobCardMatchBadge({ job }: JobCardMatchBadgeProps) {
  const notAiScored = Boolean(job.notAiScored);
  const isHighMatch = !notAiScored && job.matchRate >= 92;
  const glow = matchGlow(job.matchRate, notAiScored);

  return (
    <div
      className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm ${glow} ${
        isHighMatch
          ? 'bg-[color:var(--color-match-high-ribbon)] text-[#181c20]'
          : 'bg-surface-variant text-on-surface-variant'
      }`}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
        {notAiScored ? 'visibility_off' : isHighMatch ? 'psychology' : 'verified'}
      </span>
      <span>{notAiScored ? 'Not AI-Scored' : `${job.matchRate}% Match ${isHighMatch ? '• Top Fit' : ''}`}</span>
    </div>
  );
}
