import { API_BASE, fetchOrThrow } from './client';
import { ResumeProfile, CvExtract } from '../types';

export async function fetchResumes(userId: string = 'user-default'): Promise<any[]> {
  const response = await fetchOrThrow(`${API_BASE}/resumes?userId=${userId}`, undefined, 'Failed to fetch CVs list');
  return response.json();
}

export async function fetchResumeDetails(id: string): Promise<ResumeProfile> {
  const response = await fetchOrThrow(`${API_BASE}/resumes/${id}`, undefined, 'Failed to fetch CV details');
  return response.json();
}

/** Batch-fetch all full profiles in a single HTTP request (replaces 1+N pattern). */
export async function fetchAllProfiles(userId: string = 'user-default'): Promise<ResumeProfile[]> {
  const response = await fetchOrThrow(
    `${API_BASE}/resumes/all?userId=${userId}`,
    undefined,
    'Failed to load CVs'
  );
  return response.json();
}

export async function parseResume(file: File, userId: string = 'user-default'): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetchOrThrow(`${API_BASE}/resumes/parse`, {
    method: 'POST',
    body: formData
  }, 'Failed to parse CV');
  return response.json();
}

export async function deleteResume(id: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/resumes/${id}`, { method: 'DELETE' }, 'Failed to delete CV');
}

// Lightweight CV extract for the Customised CV wizard — skips DB persistence.
// Returns only the fields needed by the customise-resume endpoint.
export async function extractCv(file: File): Promise<CvExtract> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetchOrThrow(`${API_BASE}/resumes/extract-cv`, {
    method: 'POST',
    body: formData
  }, 'Failed to extract CV data.');
  return response.json();
}
