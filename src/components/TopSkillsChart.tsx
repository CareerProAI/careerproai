import React from 'react';
import { ResumeProfile } from '../types';

interface TopSkillsChartProps {
  profiles: ResumeProfile[];
}

const MAX_SKILLS_SHOWN = 6;

export default function TopSkillsChart({ profiles }: TopSkillsChartProps) {
  const frequency: Record<string, number> = {};
  profiles.forEach((profile) => {
    const allSkills = [...profile.skills.frameworks, ...profile.skills.tools, ...profile.skills.softSkills];
    allSkills.forEach((skill) => {
      frequency[skill] = (frequency[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, MAX_SKILLS_SHOWN);
  const maxCount = Math.max(1, ...topSkills.map(([, count]) => count));

  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-1">Top Skills</h3>
      <p className="text-xs text-on-surface-variant mb-5">
        Most frequent skills across all {profiles.length} analyzed resume{profiles.length !== 1 ? 's' : ''}
      </p>
      {topSkills.length === 0 ? (
        <p className="text-xs text-on-surface-variant">No skills detected yet.</p>
      ) : (
        <div className="space-y-3">
          {topSkills.map(([skill, count]) => (
            <div key={skill}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-bold text-on-surface">{skill}</span>
                <span className="text-xs font-bold text-on-surface-variant">{count}</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-r-full overflow-hidden">
                <div
                  className="h-full bg-[#2a78d6] dark:bg-[#3987e5] rounded-r-full"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
