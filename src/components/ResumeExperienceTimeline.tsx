import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeExperienceTimelineProps {
  currentProfile: ResumeProfile;
}

export default function ResumeExperienceTimeline({ currentProfile }: ResumeExperienceTimelineProps) {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">Experience Breakdown</h3>
      <div className="relative ml-2 space-y-6">
        {currentProfile.experience.map((exp) => (
          <div key={exp.id} className="timeline-item relative pl-8 pb-4">
            <div className="absolute left-0 top-1 w-6 h-6 bg-primary-container rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center z-10 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>

            <div className="bg-surface-container-low dark:bg-slate-950/40 p-4 rounded-xl border border-outline-variant/20 hover:shadow-md transition-all">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-on-surface leading-tight">{exp.role}</h4>
                  <p className="text-xs text-primary font-semibold mt-1">{exp.company}</p>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high dark:bg-slate-800 px-2.5 py-1 rounded">
                  {exp.dates}
                </span>
              </div>
              <ul className="text-xs text-on-surface-variant space-y-2 mt-2 list-disc list-inside leading-relaxed">
                {exp.bullets.map((b, idx) => (
                  <li key={idx}>
                    {b.includes('40%') ? (
                      <>
                        Architected micro-frontend architecture using React and Webpack Module Federation, reducing initial load time by <span className="text-tertiary font-bold">40%</span>.
                      </>
                    ) : (
                      b
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
