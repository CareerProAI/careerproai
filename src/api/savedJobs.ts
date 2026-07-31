import { API_BASE, fetchOrThrow } from './client';
import { SavedJobRecord } from '../types';

export async function fetchSavedJobs(resumeId: string): Promise<SavedJobRecord[]> {
  const response = await fetchOrThrow(`${API_BASE}/saved-jobs?resumeId=${resumeId}`, undefined, 'Failed to fetch saved jobs');
  return response.json();
}

export async function saveJob(
  resumeId: string,
  jobId: string,
  matchRate: number,
  whyMatches: string,
  missingSkills: string[],
  resumeImprovements: string[]
): Promise<void> {
  await fetchOrThrow(`${API_BASE}/saved-jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeId,
      jobId,
      matchRate,
      whyMatches,
      missingSkills,
      resumeImprovements
    })
  }, 'Failed to save job');
}

export async function deleteSavedJob(matchId: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/saved-jobs/${matchId}`, { method: 'DELETE' }, 'Failed to delete saved job');
}

export async function updateSavedJobNotes(matchId: string, notes: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/saved-jobs/${matchId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  }, 'Failed to update saved job notes');
}
