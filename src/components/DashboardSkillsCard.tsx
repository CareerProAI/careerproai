import React from 'react';
import { SkillsMatrix } from '../types';

interface DashboardSkillsCardProps {
  skills: SkillsMatrix;
  setTab: (tab: string) => void;
}

const SKILL_GROUPS: { key: keyof SkillsMatrix; label: string; colorClass: string }[] = [
  { key: 'frameworks', label: 'Frameworks & Libraries', colorClass: 'bg-primary-container text-on-primary-container border-primary-container' },
  { key: 'tools', label: 'Tools', colorClass: 'bg-secondary-container text-on-secondary-container border-secondary-container' },
  { key: 'softSkills', label: 'Soft Skills', colorClass: 'bg-tertiary-container text-on-tertiary-container border-tertiary-container' },
];

export default function DashboardSkillsCard({ skills, setTab }: DashboardSkillsCardProps) {
  const hasAnySkills = SKILL_GROUPS.some((group) => skills[group.key].length > 0);

  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-lg font-bold text-on-surface mb-4">Skills Detected</h3>
      {hasAnySkills ? (
        <div className="space-y-4">
          {SKILL_GROUPS.filter((group) => skills[group.key].length > 0).map((group) => (
            <div key={group.key}>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {skills[group.key].map((skill) => (
                  <span key={skill} className={`px-3 py-1 rounded-full text-xs font-bold border ${group.colorClass}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">No skills detected yet.</p>
      )}
      <button onClick={() => setTab('resume')} className="w-full mt-4 text-center text-xs text-primary font-bold hover:underline">
        View Full Skill Matrix
      </button>
    </section>
  );
}
