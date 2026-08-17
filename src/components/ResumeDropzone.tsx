import React from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import RetryableError from './RetryableError';
import FilePreviewCard from './FilePreviewCard';
import ResumeSkeletons from './ResumeSkeletons';
import ResumePasteTextFallback from './ResumePasteTextFallback';
import ResumeFilePicker from './ResumeFilePicker';

interface ResumeDropzoneProps {
  dragActive: boolean;
  isProcessing: boolean;
  processingProgress: number;
  uploadText: string;
  setUploadText: (text: string) => void;
  uploadError: string | null;
  selectedFile: File | null;
  handleDrag: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  startRealAnalysis: (file: File) => void;
  triggerToast: (msg: string) => void;
}

export default function ResumeDropzone(props: ResumeDropzoneProps) {
  if (props.isProcessing) {
    return (
      <div id="processing-status" className="glass-card rounded-2xl p-6 border border-outline-variant">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="material-symbols-outlined text-primary animate-spin">autorenew</span>
            <h4 className="font-bold text-on-surface text-sm">Processing Document & AI scoring...</h4>
          </div>
          <span className="text-xs font-bold text-primary">{props.processingProgress}%</span>
        </div>
        <div className="h-2 bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${props.processingProgress}%` }} />
        </div>
        <ResumeSkeletons />
      </div>
    );
  }

  if (props.uploadError) {
    return (
      <RetryableError
        message={props.uploadError}
        onRetry={() => (props.selectedFile ? props.startRealAnalysis(props.selectedFile) : props.handleRemoveFile())}
      />
    );
  }

  if (props.selectedFile) {
    const file = props.selectedFile;
    return (
      <FilePreviewCard file={file} onRemove={props.handleRemoveFile} onAnalyze={() => props.startRealAnalysis(file)} />
    );
  }

  return (
    <div
      id="dropzone"
      onDragEnter={props.handleDrag}
      onDragOver={props.handleDrag}
      onDragLeave={props.handleDrag}
      onDrop={props.handleDrop}
      className={`glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all min-h-[340px] group ${
        props.dragActive ? 'border-primary bg-primary/5' : 'border-outline-variant/80 hover:border-primary/50'
      }`}
    >
      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
        <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-primary">upload_file</span>
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-1">Drag and drop your resume here</h3>
      <p className="text-xs text-on-surface-variant mb-6">PDF, DOCX, or TXT — max 5MB each</p>
      <ResumeFilePicker onSelect={props.handleFileSelect} />

      <ResumePasteTextFallback
        uploadText={props.uploadText}
        setUploadText={props.setUploadText}
        onSubmit={props.startRealAnalysis}
        triggerToast={props.triggerToast}
      />
    </div>
  );
}
