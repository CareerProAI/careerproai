import React from 'react';

interface SavedJobsEmptyStateProps {
  onBrowseJobs: () => void;
}

export default function SavedJobsEmptyState({ onBrowseJobs }: SavedJobsEmptyStateProps) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center border border-outline-variant/60">
      <span className="material-symbols-outlined text-5xl text-outline mb-3">bookmark_border</span>
      <h3 className="text-base font-bold text-on-surface">No saved jobs yet</h3>
      <p className="text-xs text-on-surface-variant mt-1 mb-4">Bookmark a job from Job Search to see it here.</p>
      <button onClick={onBrowseJobs} className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs">
        Go to Job Search
      </button>
    </div>
  );
}
