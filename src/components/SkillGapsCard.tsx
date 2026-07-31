import React from 'react';

interface SkillGapsCardProps {
  missingSkills: string[];
  targetRole: string;
}

export default function SkillGapsCard({ missingSkills, targetRole }: SkillGapsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-on-surface-variant mb-1">Skill Gaps</h3>
      <p className="text-[11px] text-on-surface-variant mb-4">Missing for {targetRole}</p>
      {missingSkills.length === 0 ? (
        <p className="text-xs text-tertiary font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">verified</span>
          No skill gaps detected
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-error-container text-on-error-container rounded-lg text-[11px] font-bold border border-error-container"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
