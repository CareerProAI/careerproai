import React from 'react';
import { Job, ResumeProfile } from '../types';
import JobFeedColumn from './JobFeedColumn';

interface JobFeedListProps {
  sortedJobs: Job[];
  sortMode: 'relevance' | 'latest' | 'salary' | 'bestMatch';
  setSortMode: (mode: 'relevance' | 'latest' | 'salary' | 'bestMatch') => void;
  currentProfile: ResumeProfile;
  isApplied: (jobId: string) => boolean;
  savedJobIds: string[];
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onCompare: (job: Job) => void;
  tabFilter: 'all' | 'recommended';
}

export default function JobFeedList({
  sortedJobs,
  sortMode,
  setSortMode,
  currentProfile,
  isApplied,
  savedJobIds,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
  tabFilter,
}: JobFeedListProps) {
  const bdjobsJobs = sortedJobs.filter((job) => job.source === 'bdjobs');
  const linkedinJobs = sortedJobs.filter((job) => job.source === 'linkedin');
  const columnProps = { currentProfile, isApplied, savedJobIds, onApplyJob, onSaveJob, onViewDetails, onCompare, tabFilter };

  return (
    <div className="flex-1 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-on-surface-variant font-semibold">
          {sortedJobs.length} job{sortedJobs.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="job-sort-select" className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Sort
          </label>
          <select
            id="job-sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as 'relevance' | 'latest' | 'salary' | 'bestMatch')}
            className="px-3 py-1.5 rounded-xl border border-outline-variant/60 bg-white dark:bg-slate-900 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="relevance">Relevance</option>
            <option value="latest">Latest</option>
            <option value="salary">Salary</option>
            <option value="bestMatch">Best Match</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JobFeedColumn label="BDJOBS" jobs={bdjobsJobs} {...columnProps} />
        <JobFeedColumn label="LinkedIn" jobs={linkedinJobs} {...columnProps} />
      </div>
    </div>
  );
}
