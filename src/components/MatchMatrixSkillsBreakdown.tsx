import React from 'react';
import { Job, ResumeProfile } from '../types';

interface MatchMatrixSkillsBreakdownProps {
  compareJob: Job;
  currentProfile: ResumeProfile;
}

export default function MatchMatrixSkillsBreakdown({ compareJob, currentProfile }: MatchMatrixSkillsBreakdownProps) {
  const knownSkills = [...currentProfile.skills.frameworks, ...currentProfile.skills.tools];
  const matchedSkills = compareJob.skills.filter((sk) => knownSkills.includes(sk));
  const missingSkills = compareJob.skills.filter((sk) => !knownSkills.includes(sk));

  return (
    <div>
      <h4 className="text-xs font-bold text-on-surface mb-3 uppercase tracking-wider text-on-surface-variant">Skills Match Breakdown</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-outline-variant/30 rounded-xl p-3 bg-surface-container-low dark:bg-slate-950/40">
          <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">check_circle</span> Matched Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.map((sk) => (
              <span key={sk} className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-[10px] font-bold">
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="border border-outline-variant/30 rounded-xl p-3 bg-surface-container-low dark:bg-slate-950/40">
          <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">warning</span> Missing/Gap Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {missingSkills.map((sk) => (
              <span key={sk} className="px-2 py-0.5 bg-error-container text-on-error-container rounded text-[10px] font-bold">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
