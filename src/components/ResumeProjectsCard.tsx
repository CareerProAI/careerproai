import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeProjectsCardProps {
  currentProfile: ResumeProfile;
}

export default function ResumeProjectsCard({ currentProfile }: ResumeProjectsCardProps) {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
      <h3 className="text-base font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3 flex items-center gap-2">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-lg">folder_shared</span>
        Featured Projects
      </h3>
      {currentProfile.projects && currentProfile.projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentProfile.projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low dark:bg-slate-950/40 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <h4 className="text-xs font-bold text-on-surface mb-2">{proj.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{proj.description}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-outline-variant/20 rounded text-[10px] font-bold text-on-surface-variant">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 text-[11px] font-bold text-primary">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                      <span aria-hidden="true" className="material-symbols-outlined text-xs">code</span> GitHub
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                      <span aria-hidden="true" className="material-symbols-outlined text-xs">open_in_new</span> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">No projects listed.</p>
      )}
    </div>
  );
}
