import React from 'react';

interface ApplicationsEmptyStateProps {
  onBrowseJobs: () => void;
}

export default function ApplicationsEmptyState({ onBrowseJobs }: ApplicationsEmptyStateProps) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-outline-variant/60">
      <span className="material-symbols-outlined text-5xl text-outline mb-3">assignment_turned_in</span>
      <h3 className="text-base font-bold text-on-surface">No applications yet</h3>
      <p className="text-xs text-on-surface-variant mt-1 mb-4">Apply to a job from Job Search to track it here.</p>
      <button onClick={onBrowseJobs} className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs">
        Go to Job Search
      </button>
    </div>
  );
}
