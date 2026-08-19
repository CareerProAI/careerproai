import React from 'react';
import { ApplicationPackage } from '../api';
import RetryableError from './RetryableError';
import ApplicationPackagePreview from './ApplicationPackagePreview';

interface CustomizedResumeResultsProps {
  data: ApplicationPackage | null;
  loading: boolean;
  error: string | null;
  targetLabel: string;
  onRetry: () => void;
}

export default function CustomizedResumeResults({
  data, loading, error, targetLabel, onRetry,
}: CustomizedResumeResultsProps) {
  const fileBase = (targetLabel || 'custom').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 space-y-3">
        <div className="h-2.5 bg-outline-variant/40 rounded w-full animate-pulse"></div>
        <div className="h-2.5 bg-outline-variant/40 rounded w-5/6 animate-pulse"></div>
        <div className="h-2.5 bg-outline-variant/40 rounded w-4/6 animate-pulse"></div>
        <p className="text-xs text-on-surface-variant text-center pt-2">
          Parsing your CV and generating tailored materials — this can take up to a minute...
        </p>
      </div>
    );
  }

  if (error) return <RetryableError message={error} onRetry={onRetry} />;

  if (!data) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-outline-variant/60 space-y-5">
      <h3 className="text-sm font-bold text-on-surface">Tailored for {targetLabel}</h3>
      <ApplicationPackagePreview title="Tailored CV" text={data.resumeText} pdfBase64={data.resumePdfBase64} fileName={`cv-${fileBase}.pdf`} />
      <ApplicationPackagePreview title="Cover Letter" text={data.coverLetterText} pdfBase64={data.coverLetterPdfBase64} fileName={`cover-letter-${fileBase}.pdf`} />
    </div>
  );
}
