import { useRef, useState } from 'react';
import { generateApplicationPackage, parseResume, fetchResumeDetails, ApplicationPackage } from '../api';
import { ResumeProfile } from '../types';
import { isProfileReadyForApplication } from '../utils/isProfileReadyForApplication';
import { buildCustomJob } from '../utils/buildCustomJob';

export interface CustomizedResumeInput {
  file: File | null;
  title: string;
  company: string;
  description: string;
}

// Facade: parse an optional upload, then generate a tailored CV + cover letter.
export function useCustomizedResume(
  currentProfile: ResumeProfile | null,
  onParsedProfile?: (profile: ResumeProfile) => void,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApplicationPackage | null>(null);
  const [targetLabel, setTargetLabel] = useState('');
  const lastRef = useRef<CustomizedResumeInput | null>(null);

  const generate = async (input: CustomizedResumeInput) => {
    const description = input.description.trim();
    if (!description) {
      setError('Paste the job description so we can tailor the CV and cover letter.');
      return;
    }
    lastRef.current = input;
    setLoading(true);
    setError(null);
    setData(null);
    let profile = currentProfile;
    if (input.file) {
      try {
        const parsed = await parseResume(input.file);
        profile = parsed.profile || await fetchResumeDetails(parsed.resumeId);
        onParsedProfile?.(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CV.');
        setLoading(false);
        return;
      }
    }
    if (!isProfileReadyForApplication(profile)) {
      setError('Upload a PDF or DOCX CV so we can tailor this application.');
      setLoading(false);
      return;
    }
    const job = buildCustomJob({ title: input.title, company: input.company, description });
    setTargetLabel(`${job.title} at ${job.company}`);
    try {
      setData(await generateApplicationPackage(profile, job));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate application materials.');
    } finally {
      setLoading(false);
    }
  };

  return {
    data, loading, error, targetLabel, generate,
    retry: () => { if (lastRef.current) generate(lastRef.current); },
    hasReadyProfile: isProfileReadyForApplication(currentProfile),
  };
}
