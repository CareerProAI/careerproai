import React from 'react';
import { Job, ResumeProfile } from '../types';

const SUMMARY_LENGTH = 140;

interface JobCardInsightsProps {
  job: Job;
  currentProfile: ResumeProfile;
  onViewDetails: () => void;
}

export default function JobCardInsights({ job, currentProfile, onViewDetails }: JobCardInsightsProps) {
  const description = job.description?.trim();
  // Both bdjobs and LinkedIn fetch a missing description lazily when details are opened
  // (see useJobDescription), so "click to view" is a genuine promise for either source —
  // only jobs with no known source (dead mockJobs.ts data) have no fetch mechanism at all.
  const summary = description
    ? description.slice(0, SUMMARY_LENGTH) + (description.length > SUMMARY_LENGTH ? '…' : '')
    : job.source === 'bdjobs' || job.source === 'linkedin'
      ? 'Click to view full job description'
      : 'No description available for this listing.';

  return (
    <>
      <button
        type="button"
        onClick={onViewDetails}
        className="mt-3 text-left text-xs text-on-surface-variant leading-relaxed hover:text-on-surface hover:underline transition-colors w-full whitespace-pre-wrap"
      >
        {summary}
      </button>

      <div className="mt-3 p-3 bg-secondary-fixed/15 dark:bg-slate-950/40 rounded-xl border border-secondary-fixed/30 dark:border-slate-800/60 flex gap-2">
        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">insights</span>
        <div>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Why it matches</p>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {job.id === 'job-stark'
              ? `Matches 9/10 required skills. Your tenure as a ${currentProfile.currentRole} aligns heavily with their core stack.`
              : job.whyMatches}
          </p>
        </div>
      </div>
    </>
  );
}
