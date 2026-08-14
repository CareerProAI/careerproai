import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeCredentialsCardProps {
  currentProfile: ResumeProfile;
}

export default function ResumeCredentialsCard({ currentProfile }: ResumeCredentialsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex-1">
      <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-lg">verified_user</span>
        Credentials &amp; Languages
      </h3>
      <div className="space-y-5">
        <div>
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Certifications</h4>
          <div className="space-y-2">
            {currentProfile.certifications && currentProfile.certifications.length > 0 ? (
              currentProfile.certifications.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <p className="font-bold text-on-surface leading-tight">{cert.name}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {cert.institution} {cert.year && `• ${cert.year}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-on-surface-variant">No certifications listed.</p>
            )}
          </div>
        </div>

        {currentProfile.languages && currentProfile.languages.length > 0 && (
          <div className="border-t border-outline-variant/30 pt-4">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Languages</h4>
            <div className="flex flex-wrap gap-1.5">
              {currentProfile.languages.map((lang) => (
                <span key={lang.id} className="px-2 py-1 bg-surface-container-high dark:bg-slate-800 rounded text-xs font-semibold text-on-surface">
                  {lang.name} {lang.proficiency && `(${lang.proficiency})`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
