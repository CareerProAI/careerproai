import { useState } from 'react';
import { Job, Application } from '../types';
import { parseSalaryMin } from '../utils/jobFilters';

// Real-world AI scoring rarely reaches 90+ even for a genuinely strong fit (observed range
// on live listings: 0-85%) — 75% surfaces truly relevant matches without leaving this tab
// empty in normal use, which a stricter bar did.
export const RECOMMENDED_MATCH_THRESHOLD = 75;

export function useJobFilters(jobs: Job[], applications: Application[], searchQuery: string, initialTabFilter: 'all' | 'recommended') {
  const [tabFilter, setTabFilter] = useState<'all' | 'recommended'>(initialTabFilter);
  const [sortMode, setSortMode] = useState<'relevance' | 'latest' | 'salary' | 'bestMatch'>('relevance');

  const filteredJobs = jobs.filter((job) => {
    if (tabFilter === 'recommended' && job.matchRate < RECOMMENDED_MATCH_THRESHOLD) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchesKeyword =
        (job.title ?? '').toLowerCase().includes(q) ||
        (job.company ?? '').toLowerCase().includes(q) ||
        job.skills.some((skill) => (skill ?? '').toLowerCase().includes(q));
      if (!matchesKeyword) return false;
    }

    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortMode) {
      case 'latest':
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      case 'salary':
        return parseSalaryMin(b.salary) - parseSalaryMin(a.salary);
      case 'bestMatch':
        return b.matchRate - a.matchRate;
      case 'relevance':
      default:
        return 0;
    }
  });

  const isApplied = (jobId: string) => applications.some((app) => app.jobId === jobId);

  return { tabFilter, setTabFilter, sortMode, setSortMode, sortedJobs, isApplied };
}
