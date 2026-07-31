import React from 'react';
import { ResumeProfile } from '../types';
import ResumeView from './ResumeView';
import RetryableError from './RetryableError';

interface ResumeBootstrapGateProps {
  isLoadingProfiles: boolean;
  loadError: string | null;
  onRetryLoad: () => void;
  currentProfile: ResumeProfile | null;
  tab: string;
  setTab: (tab: string) => void;
  profiles: ResumeProfile[];
  onSelectProfile: (profile: ResumeProfile) => void;
  onUploadNewProfile: (newProfile: ResumeProfile) => void;
  onAddSkill: (skill: string) => void;
  children: (currentProfile: ResumeProfile) => React.ReactNode;
}

export default function ResumeBootstrapGate({
  isLoadingProfiles,
  loadError,
  onRetryLoad,
  currentProfile,
  tab,
  setTab,
  profiles,
  onSelectProfile,
  onUploadNewProfile,
  onAddSkill,
  children,
}: ResumeBootstrapGateProps) {
  if (isLoadingProfiles) {
    return <div className="text-center py-24 text-sm text-on-surface-variant">Loading resume profiles…</div>;
  }
  if (loadError) {
    return (
      <div className="py-12">
        <RetryableError
          message={`Failed to load resumes: ${loadError}. Is the API server running (npm run server)?`}
          onRetry={onRetryLoad}
        />
      </div>
    );
  }
  if (!currentProfile) {
    if (tab === 'resume') {
      return (
        <ResumeView
          currentProfile={null}
          profiles={profiles}
          onSelectProfile={onSelectProfile}
          onUploadNewProfile={onUploadNewProfile}
          onAddSkill={onAddSkill}
        />
      );
    }
    return (
      <div className="text-center py-24">
        <p className="text-sm text-on-surface-variant mb-4">No resumes yet — upload one to get started.</p>
        <button
          onClick={() => setTab('resume')}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs"
        >
          Go to Resume Upload
        </button>
      </div>
    );
  }
  return <>{children(currentProfile)}</>;
}
