import React from 'react';

// Skeleton structure shown during simulated upload processing
export default function ResumeSkeletons() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-32 bg-surface-variant dark:bg-slate-800 rounded mb-4 skeleton-shimmer"></div>
        <div className="flex gap-4 mb-3">
          <div className="h-12 w-12 rounded-full bg-surface-container dark:bg-slate-800 skeleton-shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-surface-container dark:bg-slate-800 rounded skeleton-shimmer"></div>
            <div className="h-3 w-1/4 bg-surface-container dark:bg-slate-800 rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="h-4 w-40 bg-surface-variant dark:bg-slate-800 rounded mb-4 skeleton-shimmer"></div>
        <div className="space-y-3">
          <div className="h-16 w-full bg-surface-container dark:bg-slate-800 rounded skeleton-shimmer"></div>
          <div className="h-16 w-full bg-surface-container dark:bg-slate-800 rounded skeleton-shimmer"></div>
        </div>
      </div>
      <div>
        <div className="h-4 w-24 bg-surface-variant dark:bg-slate-800 rounded mb-4 skeleton-shimmer"></div>
        <div className="flex gap-2 flex-wrap">
          <div className="h-8 w-20 bg-surface-container dark:bg-slate-800 rounded-full skeleton-shimmer"></div>
          <div className="h-8 w-24 bg-surface-container dark:bg-slate-800 rounded-full skeleton-shimmer"></div>
          <div className="h-8 w-16 bg-surface-container dark:bg-slate-800 rounded-full skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
