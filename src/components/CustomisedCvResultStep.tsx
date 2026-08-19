import React from 'react';
import { ApplicationPackage } from '../api';
import CvDownloadPanel from './CvDownloadPanel';

interface Props {
  result: ApplicationPackage;
  profileName: string;
  onReset: () => void;
  onBack: () => void;
}

export default function CustomisedCvResultStep({ result, profileName, onReset, onBack }: Props) {
  const slug = profileName.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-primary">check_circle</span>
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-on-surface text-sm">Your Tailored Documents Are Ready</h3>
          <p className="text-xs text-on-surface-variant truncate">Customised for {profileName}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onBack}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-outline-variant text-xs font-medium text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>Edit JD
          </button>
          <button onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-outline-variant text-xs font-medium text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>Start Over
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <CvDownloadPanel
          title="Tailored CV"
          icon="description"
          text={result.resumeText}
          pdfBase64={result.resumePdfBase64}
          filename={`${slug}-tailored-cv.pdf`}
        />
        <CvDownloadPanel
          title="Cover Letter"
          icon="mail"
          text={result.coverLetterText}
          pdfBase64={result.coverLetterPdfBase64}
          filename={`${slug}-cover-letter.pdf`}
        />
      </div>
    </div>
  );
}
