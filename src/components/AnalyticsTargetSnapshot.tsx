import React from 'react';
import { ResumeProfile } from '../types';

interface AnalyticsTargetSnapshotProps {
  currentProfile: ResumeProfile;
}

export default function AnalyticsTargetSnapshot({ currentProfile }: AnalyticsTargetSnapshotProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-4">Target Role Snapshot</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Your Active Score</span>
          <span className="font-extrabold text-primary">{currentProfile.score} / 100</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Target Role</span>
          <span className="font-extrabold text-on-surface">{currentProfile.gapAnalysis.targetRole}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-on-surface-variant">Skills Still Needed</span>
          <span className="font-extrabold text-tertiary">{currentProfile.gapAnalysis.missingSkills.length}</span>
        </div>
      </div>
    </div>
  );
}
