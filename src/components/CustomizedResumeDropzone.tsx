import React from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import ResumeFilePicker from './ResumeFilePicker';

interface CustomizedResumeDropzoneProps {
  file: File | null;
  fileError: string | null;
  dragActive: boolean;
  hasReadyProfile: boolean;
  profileName?: string;
  handleDrag: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function CustomizedResumeDropzone({
  file, fileError, dragActive, hasReadyProfile, profileName,
  handleDrag, handleDrop, handleFileSelect, onRemove,
}: CustomizedResumeDropzoneProps) {
  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low px-4 py-3">
        <div className="min-w-0 flex items-center gap-3">
          <span aria-hidden="true" className="material-symbols-outlined text-primary">description</span>
          <p className="text-xs font-bold text-on-surface truncate">{file.name}</p>
        </div>
        <button type="button" onClick={onRemove} className="text-xs font-bold text-primary hover:underline shrink-0">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed p-6 flex flex-col items-center text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/80 bg-surface-container-low'
      }`}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-primary mb-2">upload_file</span>
      <p className="text-sm font-bold text-on-surface">Upload resume</p>
      <p className="text-xs text-on-surface-variant mb-4">PDF or DOCX — max 5MB</p>
      <ResumeFilePicker onSelect={handleFileSelect} />
      {hasReadyProfile && profileName ? (
        <p className="text-[11px] text-on-surface-variant mt-3">
          Or keep using {profileName}&apos;s analyzed resume
        </p>
      ) : null}
      {fileError ? <p role="alert" className="text-xs text-error mt-2">{fileError}</p> : null}
    </div>
  );
}
