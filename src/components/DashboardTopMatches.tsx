import React from 'react';
import { Job, Application } from '../types';
import Card from './ui/Card';

interface DashboardTopMatchesProps {
  jobs: Job[];
  jobsLoading: boolean;
  applications: Application[];
  setTab: (tab: string) => void;
  onApplyJob: (job: Job) => void;
}

export default function DashboardTopMatches({ jobs, jobsLoading, applications, setTab, onApplyJob }: DashboardTopMatchesProps) {
  const sortedJobs = [...jobs].sort((a, b) => b.matchRate - a.matchRate).slice(0, 2);
  const isApplied = (jobId: string) => applications.some((app) => app.jobId === jobId);

  return (
    <Card as="section">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-on-surface">Top Job Matches</h3>
        <button onClick={() => setTab('jobs')} className="text-xs text-primary font-bold hover:underline transition-all">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {jobsLoading ? (
          [0, 1].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-surface-container dark:bg-slate-800 skeleton-shimmer" />
          ))
        ) : sortedJobs.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No scored matches yet.{' '}
            <button onClick={() => setTab('jobs')} className="text-primary font-bold hover:underline">
              Browse jobs
            </button>
          </p>
        ) : (
          sortedJobs.map((job) => {
          const applied = isApplied(job.id);
          return (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-outline-variant/40 rounded-xl hover:border-primary/40 transition-colors bg-surface-container-lowest dark:bg-slate-950 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl flex items-center justify-center p-1 relative overflow-hidden">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">business</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{job.title}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {job.company} • {job.location} ({job.workplaceType})
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-outline-variant/30 pt-3 sm:pt-0">
                <span className="px-2.5 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold shadow-sm">
                  {job.matchRate}% Match
                </span>
                {applied ? (
                  <span className="text-xs font-bold text-tertiary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => onApplyJob(job)}
                    className="text-xs text-primary hover:text-primary-container font-extrabold hover:underline transition-all mt-1 uppercase tracking-wider"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </Card>
  );
}

