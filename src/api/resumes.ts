import { API_BASE, fetchOrThrow } from './client';
import { ResumeProfile } from '../types';

export async function fetchResumes(userId: string = 'user-default'): Promise<any[]> {
  const response = await fetchOrThrow(`${API_BASE}/resumes?userId=${userId}`, undefined, 'Failed to fetch CV list');
  return response.json();
}

export async function fetchResumeDetails(id: string): Promise<ResumeProfile> {
  const response = await fetchOrThrow(`${API_BASE}/resumes/${id}`, undefined, 'Failed to fetch CV details');
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
