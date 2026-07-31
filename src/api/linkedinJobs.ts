import { API_BASE, fetchOrThrow } from './client';
import { LinkedInJobSearchResponse } from '../types';

export async function fetchLinkedInJobs(
  keywords = '',
  location = '',
  count = 10,
  signal?: AbortSignal
): Promise<LinkedInJobSearchResponse> {
  const params = new URLSearchParams({ keywords, location, count: String(count) });
  const response = await fetchOrThrow(`${API_BASE}/external-jobs/linkedin?${params}`, { signal }, 'Failed to load LinkedIn listings.');
  return response.json();
}

export async function fetchLinkedInJobDescription(sourceUrl: string, signal?: AbortSignal): Promise<string> {
  const params = new URLSearchParams({ url: sourceUrl });
  const response = await fetchOrThrow(
    `${API_BASE}/external-jobs/linkedin/description?${params}`,
    { signal },
    'Failed to load the full job description.'
  );
  const data = await response.json();
  return data.description || '';
}
