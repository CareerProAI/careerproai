import { useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { validateResumeFile } from '../utils/validateResumeFile';

export function useResumeFilePick() {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const takeFile = (next?: File) => {
    if (!next) return;
    const error = validateResumeFile(next);
    setFileError(error);
    setFile(error ? null : next);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    takeFile(e.dataTransfer.files?.[0]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    takeFile(e.target.files?.[0]);
  };

  const resetFile = () => {
    setFile(null);
    setFileError(null);
    setDragActive(false);
  };

  return {
    file, fileError, dragActive,
    handleDrag, handleDrop, handleFileSelect, resetFile,
    requireFile: (hasReadyProfile: boolean) => {
      if (file || hasReadyProfile) return true;
      setFileError('Upload a PDF or DOCX resume first.');
      return false;
    },
  };
}
