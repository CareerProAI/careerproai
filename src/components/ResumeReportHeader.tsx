import React from 'react';
import { ResumeProfile } from '../types';

interface ResumeReportHeaderProps {
  currentProfile: ResumeProfile;
  onDownloadPdf: () => void;
  onShareProfile: () => void;
  onUpdateResume: () => void;
}

export default function ResumeReportHeader({ currentProfile, onDownloadPdf, onShareProfile, onUpdateResume }: ResumeReportHeaderProps) {
  const contact = currentProfile.contactInfo;
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/40 pb-5">
      <div>
        <h2 className="font-sans text-2xl font-extrabold text-on-surface">{currentProfile.candidateName} Resume</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Last analyzed: <span className="font-semibold text-primary">{currentProfile.lastAnalyzed}</span>
        </p>
        {contact && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-on-surface-variant">
            {contact.email && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">phone</span>
                <span>{contact.phone}</span>
              </span>
            )}
            {contact.address && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">home</span>
                <span>{contact.address}</span>
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">link</span>
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
              </span>
            )}
            {contact.github && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">code</span>
                <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
              </span>
            )}
            {contact.portfolio && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">public</span>
                <a href={contact.portfolio} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Portfolio</a>
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <button
          onClick={onDownloadPdf}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-variant text-xs font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span> Download PDF
        </button>
        <button
          onClick={onShareProfile}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-outline-variant text-on-surface rounded-xl hover:bg-surface-variant text-xs font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-sm">share</span> Share Profile
        </button>
        <button
          onClick={onUpdateResume}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl hover:bg-primary/95 text-xs font-semibold shadow-md transition-colors"
        >
          <span className="material-symbols-outlined text-sm">autorenew</span> Update Resume
        </button>
      </div>
    </div>
  );
}
