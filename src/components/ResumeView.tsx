import React, { useState } from 'react';
import { ResumeProfile } from '../types';
import Toast from './ui/Toast';
import ResumeUploadSection from './ResumeUploadSection';
import ResumeReportSection from './ResumeReportSection';

interface ResumeViewProps {
  currentProfile: ResumeProfile | null;
  profiles: ResumeProfile[];
  onSelectProfile: (profile: ResumeProfile) => void;
  onUploadNewProfile: (newProfile: ResumeProfile) => void;
  onAddSkill: (skill: string) => void;
}

export default function ResumeView({
  currentProfile,
  profiles,
  onSelectProfile,
  onUploadNewProfile,
  onAddSkill,
}: ResumeViewProps) {
  const [subView, setSubView] = useState<'report' | 'upload'>(currentProfile ? 'report' : 'upload');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div id="view-resume-container" className="animate-in fade-in duration-300">
      {showToast && <Toast message={toastMessage} />}

      <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3 mb-6">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-on-surface">CV Insights</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Parse, score, and evaluate CVs with AI.</p>
        </div>
        <div className="flex bg-surface-container-low dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setSubView('report')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subView === 'report' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Detailed Report
          </button>
          <button
            onClick={() => setSubView('upload')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subView === 'upload' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Upload CV
          </button>
        </div>
      </div>

      {subView === 'upload' || !currentProfile ? (
        <ResumeUploadSection
          profiles={profiles}
          currentProfile={currentProfile}
          onSelectProfile={onSelectProfile}
          onUploadNewProfile={onUploadNewProfile}
          triggerToast={triggerToast}
          onSwitchToReport={() => setSubView('report')}
        />
      ) : (
        <ResumeReportSection
          currentProfile={currentProfile}
          onAddSkill={onAddSkill}
          triggerToast={triggerToast}
          onSwitchToUpload={() => setSubView('upload')}
        />
      )}
    </div>
  );
}
