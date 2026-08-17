import React from 'react';
import { Job, ResumeProfile } from '../types';
import JobCardActions from './JobCardActions';
import JobCardInsights from './JobCardInsights';
import JobCardMatchBadge from './JobCardMatchBadge';

interface JobCardProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so passing
  // key={job.id} at the call site type-checks.
  key?: string;
  job: Job;
  currentProfile: ResumeProfile;
  applied: boolean;
  isSaved: boolean;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: () => void;
  onCompare: () => void;
  deferred?: boolean;
}

export default function JobCard({
  job,
  currentProfile,
  applied,
  isSaved,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
  deferred = false,
}: JobCardProps) {
  return (
    <div className={`group card-hover bg-white dark:bg-slate-900 border border-outline-variant/60 hover:border-primary/40 rounded-2xl p-6 shadow-sm relative overflow-hidden${deferred ? ' job-card-deferred' : ''}`}>
      <JobCardMatchBadge job={job} />

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl border border-outline-variant/30 bg-white dark:bg-slate-950 flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-12 h-12 object-contain" />
          ) : (
            <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-2xl">business</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-extrabold text-on-surface">{job.title}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {job.company} • {job.location} ({job.workplaceType})
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="px-2.5 py-0.5 bg-surface-container dark:bg-slate-800 text-on-surface rounded text-[10px] font-bold border border-outline-variant/20">
              {job.salary}
            </span>
            {(job.skills ?? []).slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 bg-surface-container dark:bg-slate-800 text-on-surface rounded text-[10px] font-bold border border-outline-variant/20"
              >
                {skill}
              </span>
            ))}
          </div>

          <JobCardInsights job={job} currentProfile={currentProfile} onViewDetails={onViewDetails} />
        </div>
      </div>

      <JobCardActions
        job={job}
        applied={applied}
        isSaved={isSaved}
        onApplyJob={onApplyJob}
        onSaveJob={onSaveJob}
        onViewDetails={onViewDetails}
        onCompare={onCompare}
      />
    </div>
  );
}
