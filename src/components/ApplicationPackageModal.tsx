import React from 'react';
import { Job } from '../types';
import { ApplicationPackage } from '../api';
import Modal from './ui/Modal';
import RetryableError from './RetryableError';
import ApplicationPackagePreview from './ApplicationPackagePreview';

interface ApplicationPackageModalProps {
  job: Job;
  data: ApplicationPackage | null;
  loading: boolean;
  error: string | null;
  profileIncomplete: boolean;
  onClose: () => void;
  onRetry: () => void;
  onGoToProfile: () => void;
}

export default function ApplicationPackageModal({
  job,
  data,
  loading,
  error,
  profileIncomplete,
  onClose,
  onRetry,
  onGoToProfile,
}: ApplicationPackageModalProps) {
  const fileBase = (job.company || 'job').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

  return (
    <Modal scrollable onClose={onClose} labelledBy="application-package-title">
      <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4 mb-4">
        <div>
          <h3 id="application-package-title" className="text-lg font-bold text-on-surface">AI Application Package</h3>
          <p className="text-xs text-on-surface-variant">Tailored resume &amp; cover letter for {job.title} at {job.company}</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
          <span aria-hidden="true" className="material-symbols-outlined">close</span>
        </button>
      </div>

      {profileIncomplete ? (
        <div className="glass-card rounded-2xl p-8 text-center border border-primary/30 bg-primary/5">
          <span aria-hidden="true" className="material-symbols-outlined text-4xl text-primary mb-2">person_edit</span>
          <p className="text-sm font-bold text-on-surface">Complete your resume profile first</p>
          <p className="text-xs text-on-surface-variant mt-1 mb-4 max-w-sm mx-auto">
            Add your contact email and at least one work experience entry to your resume profile before generating tailored application materials.
          </p>
          <button onClick={onGoToProfile} className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:bg-primary/90 transition-colors">
            Update Resume
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3 py-6">
          <div className="h-2.5 bg-outline-variant/40 rounded w-full animate-pulse"></div>
          <div className="h-2.5 bg-outline-variant/40 rounded w-5/6 animate-pulse"></div>
          <div className="h-2.5 bg-outline-variant/40 rounded w-4/6 animate-pulse"></div>
          <p className="text-xs text-on-surface-variant text-center pt-2">
            Generating your tailored resume and cover letter — this can take up to a minute...
          </p>
        </div>
      ) : error ? (
        <RetryableError message={error} onRetry={onRetry} />
      ) : data ? (
        <div className="space-y-5">
          <ApplicationPackagePreview title="Tailored Resume" text={data.resumeText} pdfBase64={data.resumePdfBase64} fileName={`resume-${fileBase}.pdf`} />
          <ApplicationPackagePreview title="Cover Letter" text={data.coverLetterText} pdfBase64={data.coverLetterPdfBase64} fileName={`cover-letter-${fileBase}.pdf`} />
        </div>
      ) : null}
    </Modal>
  );
}
