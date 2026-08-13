import React from 'react';
import { ResumeProfile, Job, Application, ActivityLog } from '../types';
import DashboardMetricsRow from './DashboardMetricsRow';
import DashboardTopMatches from './DashboardTopMatches';
import DashboardActiveResume from './DashboardActiveResume';
import DashboardActivityTimeline from './DashboardActivityTimeline';
import DashboardSkillsCard from './DashboardSkillsCard';
import DashboardEducationCard from './DashboardEducationCard';
import DashboardRecommendationsCard from './DashboardRecommendationsCard';

interface DashboardViewProps {
  currentProfile: ResumeProfile;
  jobs: Job[];
  jobsLoading: boolean;
  applications: Application[];
  activityLogs: ActivityLog[];
  setTab: (tab: string) => void;
  onApplyJob: (job: Job) => void;
}

export default function DashboardView({
  currentProfile,
  jobs,
  jobsLoading,
  applications,
  activityLogs,
  setTab,
  onApplyJob,
}: DashboardViewProps) {
  return (
    <div id="view-dashboard" className="animate-in fade-in slide-in-from-bottom-3 duration-300">
      <section className="mb-8">
        <h2 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">
          Welcome back, {currentProfile.candidateName.split(' ')[0]}.
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5">Here's your talent profile overview for today.</p>
      </section>

      <DashboardMetricsRow currentProfile={currentProfile} jobs={jobs} jobsLoading={jobsLoading} activeAppsCount={applications.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardTopMatches jobs={jobs} jobsLoading={jobsLoading} applications={applications} setTab={setTab} onApplyJob={onApplyJob} />
          <DashboardActiveResume currentProfile={currentProfile} setTab={setTab} />
          <DashboardRecommendationsCard improvements={currentProfile.improvements} setTab={setTab} />
        </div>

        <div className="space-y-6">
          <DashboardActivityTimeline activityLogs={activityLogs} />
          <DashboardSkillsCard skills={currentProfile.skills} setTab={setTab} />
          <DashboardEducationCard education={currentProfile.education} />
        </div>
      </div>
    </div>
  );
}

