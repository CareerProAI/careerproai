import React from 'react';
import { EducationItem } from '../types';

interface DashboardEducationCardProps {
  education?: EducationItem[];
}

export default function DashboardEducationCard({ education }: DashboardEducationCardProps) {
  return (
    <section className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-lg">school</span>
        Education
      </h3>
      {education && education.length > 0 ? (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-primary/20 pl-3">
              <h4 className="text-xs font-bold text-on-surface leading-tight">{edu.degree}</h4>
              <p className="text-[11px] text-primary font-semibold mt-1">{edu.institution}</p>
              <span className="text-[10px] text-on-surface-variant font-bold block mt-0.5">Class of {edu.graduationYear}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">No education details on file.</p>
      )}
    </section>
  );
}
