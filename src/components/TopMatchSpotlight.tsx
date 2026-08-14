import React from 'react';
import { Job, ResumeProfile } from '../types';
import JobCard from './JobCard';

// Same bar JobCard already uses for its own "Top Fit" ribbon — reusing it here keeps
// "spotlighted as the best match" consistent with what a single card already claims.
const SPOTLIGHT_THRESHOLD = 92;

interface TopMatchSpotlightProps {
  jobs: Job[];
  currentProfile: ResumeProfile;
  isApplied: (jobId: string) => boolean;
  savedJobIds: string[];
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onCompare: (job: Job) => void;
}

export default function TopMatchSpotlight({
  jobs,
  currentProfile,
  isApplied,
  savedJobIds,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
}: TopMatchSpotlightProps) {
  const best = [...jobs].sort((a, b) => b.matchRate - a.matchRate)[0];
  if (!best || best.matchRate < SPOTLIGHT_THRESHOLD) return null;

  const sourceLabel = best.source === 'bdjobs' ? 'BDJOBS' : best.source === 'linkedin' ? 'LinkedIn' : null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
        <h3 className="text-sm font-extrabold text-on-surface uppercase tracking-wider">
          Top Match For You{sourceLabel ? ` · from ${sourceLabel}` : ''}
        </h3>
      </div>
      <JobCard
        job={best}
        currentProfile={currentProfile}
        applied={isApplied(best.id)}
        isSaved={savedJobIds.includes(best.id)}
        onApplyJob={onApplyJob}
        onSaveJob={onSaveJob}
        onViewDetails={() => onViewDetails(best)}
        onCompare={() => onCompare(best)}
      />
    </div>
  );
}
