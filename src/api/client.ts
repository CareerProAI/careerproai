import { resolveApiBase } from './resolveApiBase';

export { resolveApiBase };

export const API_BASE = resolveApiBase(import.meta.env.VITE_API_BASE);

// Thin fetch wrapper shared by every file in src/api/ — every backend route responds
// with `{ error: string }` on failure, so this surfaces that specific message instead of
// a generic one wherever the server provides it, falling back to `fallbackMessage` only
// when the body isn't JSON or has no `error` field. `status` is attached to the thrown
// error since matchJobsBatch (jobMatch.ts) needs it to detect a 429 for its retry logic;
// harmless for every other call site, which just ignores it.
export async function fetchOrThrow(
  url: string,
  init: RequestInit | undefined,
  fallbackMessage: string
): Promise<Response> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const err = new Error(body?.error || fallbackMessage) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }
  return response;
}
