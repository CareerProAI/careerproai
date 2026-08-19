import React, { useState } from 'react';
import type { FormEvent } from 'react';
import CustomizedResumeDropzone from './CustomizedResumeDropzone';
import CustomizedResumeJobFields from './CustomizedResumeJobFields';
import CustomizedResumeJdField from './CustomizedResumeJdField';
import { useResumeFilePick } from '../hooks/useResumeFilePick';
import { CustomizedResumeInput } from '../hooks/useCustomizedResume';

interface CustomizedResumeFormProps {
  hasReadyProfile: boolean;
  profileName?: string;
  loading: boolean;
  onSubmit: (input: CustomizedResumeInput) => void;
}

export default function CustomizedResumeForm({
  hasReadyProfile, profileName, loading, onSubmit,
}: CustomizedResumeFormProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const pick = useResumeFilePick();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pick.requireFile(hasReadyProfile)) return;
    onSubmit({ file: pick.file, title, company, description });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-outline-variant/60 space-y-5">
      <fieldset className="space-y-5 border-0 p-0 m-0" disabled={loading}>
        <legend className="text-sm font-bold text-on-surface mb-1">CV and job details</legend>
        <CustomizedResumeDropzone
          file={pick.file}
          fileError={pick.fileError}
          dragActive={pick.dragActive}
          hasReadyProfile={hasReadyProfile}
          profileName={profileName}
          handleDrag={pick.handleDrag}
          handleDrop={pick.handleDrop}
          handleFileSelect={pick.handleFileSelect}
          onRemove={pick.resetFile}
        />
        <CustomizedResumeJobFields title={title} company={company} onTitle={setTitle} onCompany={setCompany} />
        <CustomizedResumeJdField value={description} onChange={setDescription} />
      </fieldset>
      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-12 px-5 py-3 bg-primary text-on-primary font-bold rounded-xl text-sm hover:bg-primary/95 shadow-sm disabled:opacity-60"
      >
        {loading ? 'Generating…' : 'Generate CV & cover letter'}
      </button>
    </form>
  );
}
