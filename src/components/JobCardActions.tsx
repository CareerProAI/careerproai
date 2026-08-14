import React from 'react';
import { Job } from '../types';

interface JobCardActionsProps {
  job: Job;
  applied: boolean;
  isSaved: boolean;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: () => void;
  onCompare: () => void;
}

export default function JobCardActions({
  job,
  applied,
  isSaved,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
}: JobCardActionsProps) {
  return (
    <div className="mt-5 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">{job.postedTime}</span>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onViewDetails}
          className="p-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all"
          title="View Details"
          aria-label="View job details"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">visibility</span>
        </button>
        <button
          onClick={() => onSaveJob(job)}
          className={`p-2.5 rounded-xl border transition-all ${
            isSaved
              ? 'bg-secondary-container border-secondary-container text-on-secondary-container'
              : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
          title={isSaved ? 'Unsave Job' : 'Save Job'}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">
            {isSaved ? 'bookmark_added' : 'bookmark_border'}
          </span>
        </button>
        <button
          onClick={onCompare}
          className="px-4 py-2 border border-outline-variant text-primary hover:bg-surface-container rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">compare_arrows</span> Match Matrix
        </button>
        <button
          disabled={applied}
          onClick={() => onApplyJob(job)}
          className={`px-5 py-2 rounded-xl text-xs font-bold flex-1 sm:flex-none text-center shadow-sm transition-all ${
            applied
              ? 'bg-tertiary/10 text-tertiary font-bold cursor-default border border-tertiary/20'
              : 'bg-primary text-on-primary hover:bg-primary/95 cursor-pointer'
          }`}
        >
          {applied ? 'Applied' : 'Quick Apply'}
        </button>
      </div>
    </div>
  );
}
