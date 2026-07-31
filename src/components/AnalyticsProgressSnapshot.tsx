import React from 'react';

interface AnalyticsProgressSnapshotProps {
  totalAnalyses: number;
  bestScore: number;
  growth: number | null;
}

export default function AnalyticsProgressSnapshot({ totalAnalyses, bestScore, growth }: AnalyticsProgressSnapshotProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">Progress Snapshot</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Resumes Analyzed</span>
          <span className="font-extrabold text-primary">{totalAnalyses}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Best Score Achieved</span>
          <span className="font-extrabold text-on-surface">{bestScore} / 100</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Growth Since First Analysis</span>
          <span className="font-extrabold text-tertiary">
            {growth === null ? 'N/A (only one analysis)' : `${growth >= 0 ? '+' : ''}${growth} pts`}
          </span>
        </div>
      </div>
    </div>
  );
}
