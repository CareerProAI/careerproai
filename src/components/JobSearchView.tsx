import React, { useState } from 'react';
import { ResumeProfile, Job, Application } from '../types';
import { useExperienceAlignment } from '../hooks/useExperienceAlignment';
import { useJobFilters } from '../hooks/useJobFilters';
import JobSearchHeader from './JobSearchHeader';
import JobSearchResults from './JobSearchResults';
import JobSearchModals from './JobSearchModals';

interface JobSearchViewProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so the two
  // <JobSearchView key="jobs" .../> / key="ai-matching" call sites in App.tsx type-check.
  // The distinct keys are load-bearing: they force React to remount (not just re-render)
  // when navigating between the two, so `initialTabFilter`'s useState seed actually re-applies.
  key?: string;
  currentProfile: ResumeProfile;
  jobs: Job[];
  jobsLoading: boolean;
  jobsError: string | null;
  onRetryJobs: () => void;
  applications: Application[];
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  savedJobIds: string[];
  initialTabFilter?: 'all' | 'recommended';
  searchQuery: string;
}

export default function JobSearchView({
  currentProfile,
  jobs,
  jobsLoading,
  jobsError,
  onRetryJobs,
  applications,
  onApplyJob,
  onSaveJob,
  savedJobIds,
  initialTabFilter = 'all',
  searchQuery,
}: JobSearchViewProps) {
  const filters = useJobFilters(jobs, applications, searchQuery, initialTabFilter);
  const [compareJob, setCompareJob] = useState<Job | null>(null);
  const [detailsJob, setDetailsJob] = useState<Job | null>(null);
  const alignment = useExperienceAlignment(compareJob, currentProfile);

  return (
    <div id="view-job-search" className="animate-in fade-in duration-300 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary-container/10 dark:bg-slate-900 rounded-full blur-[80px] -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

      <JobSearchHeader {...filters} />

      <JobSearchResults
        loading={jobsLoading}
        error={jobsError}
        onRetry={onRetryJobs}
        filters={filters}
        currentProfile={currentProfile}
        savedJobIds={savedJobIds}
        onApplyJob={onApplyJob}
        onSaveJob={onSaveJob}
        onViewDetails={setDetailsJob}
        onCompare={setCompareJob}
      />

      <JobSearchModals
        compareJob={compareJob}
        detailsJob={detailsJob}
        currentProfile={currentProfile}
        alignment={alignment}
        savedJobIds={savedJobIds}
        isApplied={filters.isApplied}
        onApplyJob={onApplyJob}
        onSaveJob={onSaveJob}
        onCloseCompare={() => setCompareJob(null)}
        onCloseDetails={() => setDetailsJob(null)}
      />
    </div>
  );
}
