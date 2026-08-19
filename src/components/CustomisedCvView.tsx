import React from 'react';
import { ResumeProfile } from '../types';
import { useCustomisedCv } from '../hooks/useCustomisedCv';
import CustomisedCvUploadStep from './CustomisedCvUploadStep';
import CustomisedCvJdStep from './CustomisedCvJdStep';
import CustomisedCvResultStep from './CustomisedCvResultStep';

interface Props {
  currentProfile: ResumeProfile;
  onUploadNewProfile: (p: ResumeProfile) => void;
}

const STEPS = ['Upload CV', 'Job Description', 'Download'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-6" role="list" aria-label="Progress steps">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-2" role="listitem">
            <span className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${i <= current ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
              {i < current ? <span className="material-symbols-outlined text-[14px]">check</span> : i + 1}
            </span>
            <span className={`text-xs font-medium hidden sm:inline transition-colors ${i === current ? 'text-on-surface' : 'text-on-surface-variant'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-1 transition-colors ${i < current ? 'bg-primary' : 'bg-outline-variant'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function CustomisedCvView({ currentProfile, onUploadNewProfile }: Props) {
  const cv = useCustomisedCv(onUploadNewProfile);
  const stepIndex = cv.step === 'upload' ? 0 : cv.step === 'jd' ? 1 : 2;

  return (
    <main className="flex flex-col h-full p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">edit_document</span>Customised CV
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Upload your CV and paste a job description — AI rewrites your CV and drafts a personalised cover letter.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant flex-1 overflow-y-auto">
        <StepBar current={stepIndex} />

        {cv.step === 'upload' && (
          <CustomisedCvUploadStep loading={cv.loading} error={cv.error} currentProfile={currentProfile}
            onFileParsed={cv.handleFileParsed} onUseCurrentProfile={() => cv.useExistingProfile(currentProfile)} />
        )}
        {cv.step === 'jd' && (
          <CustomisedCvJdStep loading={cv.loading} error={cv.error}
            profileName={cv.profile?.candidateName ?? 'You'} onGenerate={cv.generate} onBack={cv.goBack} />
        )}
        {cv.step === 'result' && cv.result && (
          <CustomisedCvResultStep result={cv.result} profileName={cv.profile?.candidateName ?? 'You'}
            onReset={cv.reset} onBack={cv.goBack} />
        )}
      </div>
    </main>
  );
}
