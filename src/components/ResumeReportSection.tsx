import React from 'react';
import { ResumeProfile } from '../types';
import ResumeReportHeader from './ResumeReportHeader';
import ResumeScoreCard from './ResumeScoreCard';
import ResumeStrengthsCard from './ResumeStrengthsCard';
import ResumeImprovementsCard from './ResumeImprovementsCard';
import ResumeExperienceTimeline from './ResumeExperienceTimeline';
import ResumeSkillsMatrix from './ResumeSkillsMatrix';
import ResumeGapAnalysisCard from './ResumeGapAnalysisCard';
import ResumeProjectsCard from './ResumeProjectsCard';
import ResumeEducationCard from './ResumeEducationCard';
import ResumeCredentialsCard from './ResumeCredentialsCard';

interface ResumeReportSectionProps {
  currentProfile: ResumeProfile;
  onAddSkill: (skill: string) => void;
  triggerToast: (msg: string) => void;
  onSwitchToUpload: () => void;
}

export default function ResumeReportSection({ currentProfile, onAddSkill, triggerToast, onSwitchToUpload }: ResumeReportSectionProps) {
  const handleAddSkill = (skill: string) => {
    onAddSkill(skill);
    triggerToast(`Successfully studied and added "${skill}" to your active CV skills! Score increased!`);
  };

  return (
    <div className="space-y-6">
      <ResumeReportHeader
        currentProfile={currentProfile}
        onDownloadPdf={() => triggerToast('Successfully generated and downloaded PDF report!')}
        onShareProfile={() => triggerToast('Profile link copied to clipboard!')}
        onUpdateResume={onSwitchToUpload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResumeScoreCard currentProfile={currentProfile} />
        <ResumeStrengthsCard currentProfile={currentProfile} />
        <ResumeImprovementsCard currentProfile={currentProfile} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResumeExperienceTimeline currentProfile={currentProfile} />
        <div className="flex flex-col gap-6">
          <ResumeSkillsMatrix currentProfile={currentProfile} />
          <ResumeGapAnalysisCard currentProfile={currentProfile} onAddSkill={handleAddSkill} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <ResumeProjectsCard currentProfile={currentProfile} />
        <div className="flex flex-col gap-6">
          <ResumeEducationCard currentProfile={currentProfile} />
          <ResumeCredentialsCard currentProfile={currentProfile} />
        </div>
      </div>
    </div>
  );
}
