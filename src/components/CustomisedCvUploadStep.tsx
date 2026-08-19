import React, { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { ResumeProfile } from '../types';

interface Props {
  loading: boolean;
  error: string | null;
  currentProfile: ResumeProfile;
  onFileParsed: (file: File) => void;
  onUseCurrentProfile: () => void;
}

const ACCEPTED = ['pdf', 'docx', 'txt'];

export default function CustomisedCvUploadStep({ loading, error, currentProfile, onFileParsed, onUseCurrentProfile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);

  const accept = (f: File | null | undefined) => {
    if (!f) return;
    const ext = (f.name.split('.').pop() ?? '').toLowerCase();
    if (ACCEPTED.includes(ext)) setFile(f);
  };

  const handleDrag = (e: DragEvent) => { e.preventDefault(); setDrag(e.type !== 'dragleave'); };
  const handleDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files?.[0]); };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => accept(e.target.files?.[0]);

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onUseCurrentProfile} className="glass-card rounded-xl p-4 flex items-center gap-3 text-left border border-outline-variant hover:border-primary/60 transition-colors w-full">
        <span className="material-symbols-outlined text-primary text-xl">person</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface">Use current profile</p>
          <p className="text-xs text-on-surface-variant truncate">{currentProfile.candidateName} — skip upload, use my existing CV</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
      </button>

      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
        <div className="flex-1 h-px bg-outline-variant" />or upload a different CV<div className="flex-1 h-px bg-outline-variant" />
      </div>

      <div
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all min-h-[180px] cursor-pointer ${drag ? 'border-primary bg-primary/5' : 'border-outline-variant/70 hover:border-primary/50'}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleChange} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[40px] text-primary">description</span>
            <p className="font-semibold text-on-surface text-sm">{file.name}</p>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-on-surface-variant hover:text-error transition-colors mt-1">Remove</button>
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-[36px] text-primary mb-3">upload_file</span>
            <p className="font-semibold text-on-surface text-sm">Drag & drop your CV here</p>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">PDF, DOCX or TXT — max 5 MB</p>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="px-4 py-2 bg-primary text-on-primary text-xs rounded-lg font-medium hover:opacity-90 transition-opacity">Browse Files</button>
          </>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-error text-center">{error}</p>}

      <button onClick={() => file && onFileParsed(file)} disabled={!file || loading}
        className="w-full py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        {loading
          ? <><span className="material-symbols-outlined animate-spin text-base">autorenew</span>Parsing CV…</>
          : 'Parse & Continue →'}
      </button>
    </div>
  );
}
