import React, { useRef, useState } from 'react';
import { ResumeProfile } from '../types';
import DeleteResumeDialog from './DeleteResumeDialog';
import ResumeManagementRow from './ResumeManagementRow';
import { createResumeDeleteCommand, ResumeDeleteCommand } from '../utils/resumeDeleteCommand';

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
  const [pendingDelete, setPendingDelete] = useState<ResumeDeleteCommand | null>(null);
  const pendingDeleteRef = useRef<ResumeDeleteCommand | null>(null);
  pendingDeleteRef.current = pendingDelete;

  const requestDelete = (profile: ResumeProfile) => {
    setPendingDelete(createResumeDeleteCommand(profile));
  };

  const confirmDelete = () => {
    const command = pendingDeleteRef.current;
    if (!command) return;
    pendingDeleteRef.current = null;
    setPendingDelete(null);
    onDeleteProfile(command.id);
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
            <ResumeManagementRow
              key={profile.id}
              profile={profile}
              isActive={profile.id === currentProfile?.id}
              onSelect={() => onSelectProfile(profile)}
              onDelete={() => requestDelete(profile)}
            />
          ))}
        </div>
      )}
      {pendingDelete && (
        <DeleteResumeDialog
          fileName={pendingDelete.fileName}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
