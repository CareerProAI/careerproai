import React from 'react';
import { ResumeProfile, Application } from '../types';
import ScoreProgressionChart from './ScoreProgressionChart';
import AnalyticsProgressSnapshot from './AnalyticsProgressSnapshot';
import AnalyticsTargetSnapshot from './AnalyticsTargetSnapshot';
import SkillsDistributionChart from './SkillsDistributionChart';
import ApplicationsPerMonthChart from './ApplicationsPerMonthChart';
import RecruitingRatesCard from './RecruitingRatesCard';
import TopSkillsChart from './TopSkillsChart';
import SkillGapsCard from './SkillGapsCard';

interface AnalyticsViewProps {
  currentProfile: ResumeProfile;
  profiles: ResumeProfile[];
  applications: Application[];
}

export default function AnalyticsView({ currentProfile, profiles, applications }: AnalyticsViewProps) {
  // Every analyzed resume is a real, timestamped snapshot (its id embeds the
  // upload time, res-<timestamp>) — that IS the score history, no separate
  // tracking table needed.
  const sorted = [...profiles].sort((a, b) => {
    const aTime = parseInt(a.id.replace('res-', ''), 10) || 0;
    const bTime = parseInt(b.id.replace('res-', ''), 10) || 0;
    return aTime - bTime;
  });
  const historyProfiles = sorted.length > 0 ? sorted : [currentProfile];

  const scoreHistory = historyProfiles.map((profile) => ({
    label: profile.lastAnalyzed,
    score: profile.score,
  }));
  const bestScore = Math.max(...historyProfiles.map((p) => p.score));
  const growth =
    historyProfiles.length > 1
      ? historyProfiles[historyProfiles.length - 1].score - historyProfiles[0].score
      : null;

  return (
    <div id="view-analytics" className="animate-in fade-in duration-300">
      <section className="mb-8">
        <h2 className="font-sans text-3xl font-extrabold text-on-surface">Score Analytics</h2>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Track how your CV score has changed across every analysis you've run.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScoreProgressionChart scoreHistory={scoreHistory} />
          <SkillsDistributionChart skills={currentProfile.skills} />
          <ApplicationsPerMonthChart applications={applications} />
          <TopSkillsChart profiles={historyProfiles} />
        </div>
        <div className="space-y-6">
          <AnalyticsProgressSnapshot totalAnalyses={historyProfiles.length} bestScore={bestScore} growth={growth} />
          <RecruitingRatesCard applications={applications} />
          <AnalyticsTargetSnapshot currentProfile={currentProfile} />
          <SkillGapsCard missingSkills={currentProfile.gapAnalysis.missingSkills} targetRole={currentProfile.gapAnalysis.targetRole} />
        </div>
      </div>
    </div>
  );
}
