import React from 'react';
import { ResumeProfile } from '../types';
import { useResumeUpload } from '../hooks/useResumeUpload';
import ResumeDropzone from './ResumeDropzone';
import ResumeUploadHistoryTable from './ResumeUploadHistoryTable';

interface ResumeUploadSectionProps {
  profiles: ResumeProfile[];
  currentProfile: ResumeProfile | null;
  onSelectProfile: (profile: ResumeProfile) => void;
  onUploadNewProfile: (newProfile: ResumeProfile) => void;
  triggerToast: (msg: string) => void;
  onSwitchToReport: () => void;
}

export default function ResumeUploadSection({
  profiles,
  currentProfile,
  onSelectProfile,
  onUploadNewProfile,
  triggerToast,
  onSwitchToReport,
}: ResumeUploadSectionProps) {
  const upload = useResumeUpload(onUploadNewProfile, triggerToast, onSwitchToReport);

  const handleSelectHistoryRow = (profile: ResumeProfile) => {
    onSelectProfile(profile);
    onSwitchToReport();
    triggerToast(`Switched to ${profile.candidateName}'s analyzed report.`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-7 flex flex-col gap-6">
        <ResumeDropzone {...upload} triggerToast={triggerToast} />
      </div>
      <ResumeUploadHistoryTable profiles={profiles} currentProfile={currentProfile} onSelect={handleSelectHistoryRow} />
    </div>
  );
}
