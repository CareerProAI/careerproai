import React from 'react';
import { ResumeProfile } from '../types';
import CustomizedResumeForm from './CustomizedResumeForm';
import CustomizedResumeResults from './CustomizedResumeResults';
import { useCustomizedResume } from '../hooks/useCustomizedResume';

interface CustomizedResumeViewProps {
  currentProfile: ResumeProfile;
  onUploadNewProfile: (profile: ResumeProfile) => void;
}

export default function CustomizedResumeView({
  currentProfile, onUploadNewProfile,
}: CustomizedResumeViewProps) {
  const custom = useCustomizedResume(currentProfile, onUploadNewProfile);

  return (
    <div id="view-customized-cv" className="animate-in fade-in duration-300 space-y-6 max-w-3xl">
      <div className="border-b border-outline-variant/60 pb-3">
        <h2 className="font-sans text-2xl font-extrabold text-on-surface">Customized CV</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Upload a PDF or DOCX resume, paste a job description, and generate a tailored CV and cover letter.
        </p>
      </div>
      <CustomizedResumeForm
        hasReadyProfile={custom.hasReadyProfile}
        profileName={currentProfile.candidateName}
        loading={custom.loading}
        onSubmit={custom.generate}
      />
      <CustomizedResumeResults
        data={custom.data}
        loading={custom.loading}
        error={custom.error}
        targetLabel={custom.targetLabel}
        onRetry={custom.retry}
      />
    </div>
  );
}
