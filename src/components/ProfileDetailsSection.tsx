import React, { useState } from 'react';
import { ResumeProfile } from '../types';

interface ProfileDetailsSectionProps {
  // No @types/react is installed in this project, so TS has no JSX.IntrinsicAttributes
  // to auto-exclude `key` from prop-shape checks — declare it explicitly so passing
  // key={currentProfile.id} at the call site type-checks.
  key?: string;
  currentProfile: ResumeProfile;
  onUpdateProfile: (updated: Partial<ResumeProfile>) => void;
  onSaved: () => void;
}

export default function ProfileDetailsSection({
  currentProfile,
  onUpdateProfile,
  onSaved,
}: ProfileDetailsSectionProps) {
  const [candidateName, setCandidateName] = useState(currentProfile.candidateName);
  const [currentRole, setCurrentRole] = useState(currentProfile.currentRole);
  const [targetRole, setTargetRole] = useState(currentProfile.gapAnalysis.targetRole);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      candidateName,
      currentRole,
      gapAnalysis: {
        ...currentProfile.gapAnalysis,
        targetRole,
      },
    });
    onSaved();
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">Active Profile details</h3>
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        <div>
          <label htmlFor="profile-candidate-name" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Candidate Full Name</label>
          <input
            id="profile-candidate-name"
            name="name"
            type="text"
            autoComplete="name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="profile-current-role" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Current Role</label>
          <input
            id="profile-current-role"
            name="organization-title"
            type="text"
            autoComplete="organization-title"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="profile-target-role" className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Career Role (Gap Analysis Target)</label>
          <input
            id="profile-target-role"
            name="target-role"
            type="text"
            autoComplete="off"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low dark:bg-slate-950/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:bg-primary/95 transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
