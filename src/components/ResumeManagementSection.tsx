import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeManagementSectionProps {
  profiles: ResumeProfile[];
  currentProfile: ResumeProfile | null;
  onSelectProfile: (profile: ResumeProfile) => void;
  onDeleteProfile: (profileId: string) => void;
}

export default function ResumeManagementSection({
  profiles,
  currentProfile,
  onSelectProfile,
  onDeleteProfile,
}: ResumeManagementSectionProps) {
  const handleDeleteClick = (profile: ResumeProfile) => {
    if (window.confirm(`Delete "${profile.fileName}"? This cannot be undone.`)) {
      onDeleteProfile(profile.id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-1">Resume Management</h3>
      <p className="text-xs text-on-surface-variant mb-5">Manage the resumes you've analyzed.</p>
      {profiles.length === 0 ? (
        <p className="text-xs text-on-surface-variant">No resumes uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                profile.id === currentProfile?.id ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/30'
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-on-surface truncate">{profile.fileName}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {profile.candidateName} • {profile.score}/100 • {profile.lastAnalyzed}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {profile.id !== currentProfile?.id && (
                  <button onClick={() => onSelectProfile(profile)} className="text-[10px] font-bold text-primary hover:underline">
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(profile)}
                  className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                  title="Delete resume"
                  aria-label="Delete resume"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-sm leading-none">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
