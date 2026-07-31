import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeSkillsMatrixProps {
  currentProfile: ResumeProfile;
}

export default function ResumeSkillsMatrix({ currentProfile }: ResumeSkillsMatrixProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-5">Skills Matrix</h3>
      <div className="space-y-5">
        <div>
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Frameworks &amp; Libraries</h4>
          <div className="flex flex-wrap gap-1.5">
            {currentProfile.skills.frameworks.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-primary-container text-on-primary-container rounded-lg text-xs font-semibold border border-primary-container">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Technical Tools</h4>
          <div className="flex flex-wrap gap-1.5">
            {currentProfile.skills.tools.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-semibold border border-secondary-container">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Soft Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {currentProfile.skills.softSkills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-semibold border border-tertiary-container">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
