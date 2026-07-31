import React from 'react';
import { Job, ResumeProfile } from '../types';
import JobFeedStatus from './JobFeedStatus';
import TopMatchSpotlight from './TopMatchSpotlight';
import JobFeedList from './JobFeedList';

interface JobFilters {
  tabFilter: 'all' | 'recommended';
  setTabFilter: (filter: 'all' | 'recommended') => void;
  sortMode: 'relevance' | 'latest' | 'salary' | 'bestMatch';
  setSortMode: (mode: 'relevance' | 'latest' | 'salary' | 'bestMatch') => void;
  sortedJobs: Job[];
  isApplied: (jobId: string) => boolean;
}

interface JobSearchResultsProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  filters: JobFilters;
  currentProfile: ResumeProfile;
  savedJobIds: string[];
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  onCompare: (job: Job) => void;
}

export default function JobSearchResults({
  loading,
  error,
  onRetry,
  filters,
  currentProfile,
  savedJobIds,
  onApplyJob,
  onSaveJob,
  onViewDetails,
  onCompare,
}: JobSearchResultsProps) {
  if (error || loading) {
    return <JobFeedStatus loading={loading} error={error} onRetry={onRetry} />;
  }

  const cardProps = { currentProfile, savedJobIds, onApplyJob, onSaveJob, onViewDetails, onCompare };

  return (
    <>
      <TopMatchSpotlight jobs={filters.sortedJobs} isApplied={filters.isApplied} {...cardProps} />
      <JobFeedList
        sortedJobs={filters.sortedJobs}
        sortMode={filters.sortMode}
        setSortMode={filters.setSortMode}
        isApplied={filters.isApplied}
        tabFilter={filters.tabFilter}
        {...cardProps}
      />
    </>
  );
}
