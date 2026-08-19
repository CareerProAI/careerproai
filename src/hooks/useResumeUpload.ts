import { useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { parseResume, fetchResumeDetails } from '../api';
import { ResumeProfile } from '../types';
import { validateResumeFile } from '../utils/validateResumeFile';

export function useResumeUpload(
  onUploadNewProfile: (profile: ResumeProfile) => void,
  triggerToast: (msg: string) => void,
  onAnalysisSuccess: () => void
) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadText, setUploadText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  // The file chosen but not yet submitted (preview state); also doubles as the
  // retry target once an attempt fails, since it's the same "file currently in
  // the pipeline" concept either way.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const takeFile = (file?: File) => {
    if (!file) return;
    const error = validateResumeFile(file);
    setUploadError(error);
    setSelectedFile(error ? null : file);
  };

  const startRealAnalysis = async (file: File) => {
    const error = validateResumeFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    setSelectedFile(file);
    setUploadError(null);
    setIsProcessing(true);
    setProcessingProgress(5);

    // Smooth progress increment
    const interval = setInterval(() => {
      setProcessingProgress((prev) => (prev >= 90 ? prev : prev + 5));
    }, 150);

    try {
      const parsed = await parseResume(file);
      const fullProfile = parsed.profile || await fetchResumeDetails(parsed.resumeId);
      clearInterval(interval);
      setProcessingProgress(100);

      setTimeout(() => {
        onUploadNewProfile(fullProfile);
        setIsProcessing(false);
        setSelectedFile(null);
        onAnalysisSuccess();
        triggerToast('CV parsed and analyzed with AI!');
      }, 500);
    } catch (err) {
      clearInterval(interval);
      console.error('Resume parsing failed:', err);
      setIsProcessing(false);
      setUploadError(err instanceof Error ? err.message : 'Failed to parse CV. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
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

  return {
    dragActive, isProcessing, processingProgress, uploadText, setUploadText, uploadError, selectedFile,
    handleDrag, handleDrop, handleFileSelect, handleRemoveFile, startRealAnalysis,
  };
}
