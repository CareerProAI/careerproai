import React from 'react';
import { Job } from '../types';

interface JobDetailsHeaderProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailsHeader({ job, onClose }: JobDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-start border-b border-outline-variant/40 pb-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl border border-outline-variant/30 bg-white dark:bg-slate-950 flex items-center justify-center p-2 shrink-0 overflow-hidden">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">business</span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">{job.title}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{job.company} • {job.location}</p>
        </div>
      </div>
      <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
