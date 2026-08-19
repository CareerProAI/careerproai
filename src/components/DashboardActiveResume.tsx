import React from 'react';
import { ResumeProfile } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { formatProfileUpdated } from '../utils/formatRelativeTime';

interface DashboardActiveResumeProps {
  currentProfile: ResumeProfile;
  setTab: (tab: string) => void;
}

export default function DashboardActiveResume({ currentProfile, setTab }: DashboardActiveResumeProps) {
  const skillsAnalyzedCount = currentProfile.skills.frameworks.length + currentProfile.skills.tools.length;

  return (
    <Card as="section">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-on-surface">Active CV</h3>
        <span className="text-xs text-on-surface-variant font-medium">
          Last updated: {formatProfileUpdated(currentProfile.id)}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 border border-outline-variant/40 rounded-xl p-4 bg-surface-container-lowest dark:bg-slate-950 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary-container shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-3xl">description</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface truncate max-w-[280px]">{currentProfile.fileName}</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Target: <span className="font-semibold text-primary">{currentProfile.gapAnalysis.targetRole}</span>
            </p>
            <p className="text-[10px] text-on-surface-variant font-mono mt-1 uppercase tracking-wider">
              {skillsAnalyzedCount} Skills Analyzed
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setTab('resume')} className="w-full sm:w-auto text-primary">
          Manage CV
        </Button>
      </div>
    </Card>
  );
}
