import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeGapAnalysisCardProps {
  currentProfile: ResumeProfile;
  onAddSkill: (skill: string) => void;
}

export default function ResumeGapAnalysisCard({ currentProfile, onAddSkill }: ResumeGapAnalysisCardProps) {
  const { missingSkills, targetRole } = currentProfile.gapAnalysis;

  return (
    <div className="glass-card rounded-2xl p-6 bg-surface-container-low dark:bg-slate-950/50 border border-outline-variant/60 shadow-sm relative overflow-hidden flex-1">
      <div aria-hidden="true" className="absolute right-0 bottom-0 opacity-5 text-9xl leading-none material-symbols-outlined select-none pointer-events-none">
        target
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-on-surface">Target Role Gap Analysis</h3>
          <span className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-outline-variant px-2 py-1 rounded text-on-surface-variant shadow-sm">
            Target: {targetRole}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
          Skills missing from your CV that appear in 80% of job postings for your target role:
        </p>
        <div className="flex flex-col gap-2">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onAddSkill(skill)}
                className="group w-full px-3 py-2 bg-white dark:bg-slate-900 border border-dashed border-primary/60 hover:border-primary text-primary hover:bg-primary/5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">add</span>
                  {skill}
                </span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-extrabold text-primary">
                  Add to CV (+3 Pts)
                </span>
              </button>
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs text-tertiary font-bold bg-tertiary/10 p-3 rounded-xl">
              <span aria-hidden="true" className="material-symbols-outlined">verified</span>
              No skill gaps! You fully match your target Staff Architect role requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
