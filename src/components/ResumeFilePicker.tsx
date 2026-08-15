import React from 'react';
import type { ChangeEvent } from 'react';

// MIME types are required on mobile Chrome/Safari; extensions alone are ignored.
export const RESUME_FILE_ACCEPT = [
  '.pdf',
  '.docx',
  '.txt',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
].join(',');

interface ResumeFilePickerProps {
  onSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

/** Facade: click hits a real file input (opacity-0 overlay). display:none breaks Chrome. */
export default function ResumeFilePicker({ onSelect }: ResumeFilePickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSelect(e);
    e.target.value = '';
  };

  return (
    <label className="relative inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer touch-manipulation">
      <span className="pointer-events-none">Browse Files</span>
      <input
        type="file"
        name="resume"
        accept={RESUME_FILE_ACCEPT}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  );
}
