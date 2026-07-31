import React from 'react';
import { SkillsMatrix } from '../types';

interface SkillsDistributionChartProps {
  skills: SkillsMatrix;
}

// Colors from the dataviz skill's validated reference palette (slots 1/4/5) —
// passes CVD/contrast checks in both light and dark against this app's real surfaces.
const CATEGORIES: { key: keyof SkillsMatrix; label: string; barClass: string }[] = [
  { key: 'frameworks', label: 'Frameworks & Libraries', barClass: 'bg-[#2a78d6] dark:bg-[#3987e5]' },
  { key: 'tools', label: 'Tools', barClass: 'bg-[#1baf7a] dark:bg-[#199e70]' },
  { key: 'softSkills', label: 'Soft Skills', barClass: 'bg-[#eda100] dark:bg-[#c98500]' },
];

export default function SkillsDistributionChart({ skills }: SkillsDistributionChartProps) {
  const counts = CATEGORIES.map((cat) => ({ ...cat, count: skills[cat.key].length }));
  const maxCount = Math.max(1, ...counts.map((c) => c.count));
  const totalCount = counts.reduce((sum, c) => sum + c.count, 0);

  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-1">Skills Distribution</h3>
      <p className="text-xs text-on-surface-variant mb-5">{totalCount} total skills detected across categories</p>
      {totalCount === 0 ? (
        <p className="text-xs text-on-surface-variant">No skills detected yet.</p>
      ) : (
        <div className="space-y-4">
          {counts.map((cat) => (
            <div key={cat.key}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-bold text-on-surface">{cat.label}</span>
                <span className="text-xs font-bold text-on-surface-variant">{cat.count}</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-r-full overflow-hidden">
                <div
                  className={`h-full rounded-r-full transition-all ${cat.barClass}`}
                  style={{ width: `${(cat.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
