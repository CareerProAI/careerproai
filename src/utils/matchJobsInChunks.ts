import { ResumeProfile } from '../types';
import { matchJobsBatch, MatchInputJob, JobMatchResult } from '../api/jobMatch';
import { chunkArray } from './chunkArray';

// Groq / Gemini / DeepSeek max output is ~8k tokens. One JSON object per job
// overflows that at ~50–100 listings, which is why a single match-batch POST 502'd.
export const MATCH_CHUNK_SIZE = 10;
const RATE_LIMIT_RETRY_DELAY_MS = 15000;

async function matchOneChunk(
  profile: ResumeProfile,
  jobs: MatchInputJob[],
  signal: AbortSignal,
): Promise<JobMatchResult[]> {
  try {
    return await matchJobsBatch(profile, jobs, signal);
  } catch (err) {
    const status = err instanceof Error ? (err as Error & { status?: number }).status : undefined;
    if (status !== 429) throw err;
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS));
    return matchJobsBatch(profile, jobs, signal);
  }
}

/** Facade: score listings in small sequential batches so one overflow cannot blank the feed. */
export async function matchJobsInChunks(
  profile: ResumeProfile,
  jobs: MatchInputJob[],
  signal: AbortSignal,
): Promise<JobMatchResult[]> {
  const collected: JobMatchResult[] = [];
  for (const chunk of chunkArray(jobs, MATCH_CHUNK_SIZE)) {
    if (signal.aborted) break;
    try {
      collected.push(...(await matchOneChunk(profile, chunk, signal)));
    } catch (err) {
      console.error('AI match scoring failed for a chunk — continuing with remaining listings:', err);
    }
  }
  return collected;
}
