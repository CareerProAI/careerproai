import { API_BASE, fetchOrThrow } from './client';
import { BdJobSearchResponse } from '../types';

export async function fetchBdJobs(
  page: number,
  rpp = 20,
  signal?: AbortSignal,
  keyword = ''
): Promise<BdJobSearchResponse> {
  const params = new URLSearchParams({ page: String(page), rpp: String(rpp) });
  if (keyword) params.set('keyword', keyword);
  const response = await fetchOrThrow(`${API_BASE}/external-jobs?${params}`, { signal }, 'Failed to load Bdjobs.com listings.');
  return response.json();
}

export async function fetchBdJobDescription(jobId: string): Promise<string> {
  const response = await fetchOrThrow(
    `${API_BASE}/external-jobs/bdjobs/description?jobId=${jobId}`,
    undefined,
    'Failed to load the full job description.'
  );
  const data = await response.json();
  return data.description || '';
}
