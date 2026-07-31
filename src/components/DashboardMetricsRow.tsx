import React from 'react';
import { ResumeProfile, Job } from '../types';
import Card from './ui/Card';

interface DashboardMetricsRowProps {
  currentProfile: ResumeProfile;
  jobs: Job[];
  activeAppsCount: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function DashboardMetricsRow({ currentProfile, jobs, activeAppsCount }: DashboardMetricsRowProps) {
  const newMatchesCount = jobs.filter((job) => Date.now() - new Date(job.postedAt).getTime() <= ONE_DAY_MS).length;
  const skillsAnalyzedCount = currentProfile.skills.frameworks.length + currentProfile.skills.tools.length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="flex flex-col items-center justify-center relative overflow-hidden">
        <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-4">Resume Health</h3>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-surface-variant dark:stroke-slate-800"
              fill="none"
              strokeWidth="2.8"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-primary-container"
              fill="none"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray={`${currentProfile.score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-sans text-3xl font-extrabold text-primary-container">{currentProfile.score}</span>
            <span className="text-[10px] text-on-surface-variant font-bold">/ 100</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>{currentProfile.atsCompatibility}</span>
        </div>
      </Card>

      <Card className="flex flex-col justify-between">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary-container w-fit">
          <span className="material-symbols-outlined">assignment</span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Active Apps</h3>
          <p className="font-sans text-4xl font-extrabold text-on-surface">{activeAppsCount}</p>
        </div>
      </Card>

      <Card className="flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary-container">
            <span className="material-symbols-outlined">work</span>
          </div>
          <span className="text-[10px] bg-surface-container-high dark:bg-slate-800 text-on-surface-variant px-2.5 py-1 rounded-full font-bold">
            New Today
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">New Matches</h3>
          <p className="font-sans text-4xl font-extrabold text-on-surface">{newMatchesCount}</p>
        </div>
      </Card>

      <Card className="flex flex-col justify-between">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary-container w-fit">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Skills Tracked</h3>
          <p className="font-sans text-4xl font-extrabold text-on-surface">{skillsAnalyzedCount}</p>
        </div>
      </Card>
    </section>
  );
}
