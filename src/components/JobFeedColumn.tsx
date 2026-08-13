import React from 'react';
import { Job, ResumeProfile } from '../types';
import JobCard from './JobCard';

interface JobFeedColumnProps {
  label: string;
  jobs: Job[];
  currentProfile: ResumeProfile;
  isApplied: (jobId: string) => boolean;
  savedJobIds: string[];
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onCompare: (job: Job) => void;
}

export default function JobFeedColumn({
  label,
  jobs,
  currentProfile,
  isApplied,
  savedJobIds,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
}: JobFeedColumnProps) {
  return (
    <div className="flex-1 space-y-5 min-w-0">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant px-1">
        {label} · {jobs.length}
      </h3>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            currentProfile={currentProfile}
            applied={isApplied(job.id)}
            isSaved={savedJobIds.includes(job.id)}
            onApplyJob={onApplyJob}
            onSaveJob={onSaveJob}
            onViewDetails={() => onViewDetails(job)}
            onCompare={() => onCompare(job)}
          />
        ))
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center border border-outline-variant/60">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
          <p className="text-xs text-on-surface-variant">No {label} listings match your search.</p>
        </div>
      )}
    </div>
  );
}

