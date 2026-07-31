// Shared HTTP helpers for the API-level tests in tests/api/. These hit a REAL,
// already-running `npm run server` instance (default http://localhost:3001) — there is
// no supertest/in-process app here, deliberately: server.js never exports its Express
// `app` (it calls app.listen() at module scope), and adding that export purely to
// support tests would be a bigger change to server.js than this task warrants.
import 'dotenv/config';

export const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export interface Prereqs {
  reachable: boolean;
  aiConfigured: boolean;
}

// Tests call this and skip (not fail) when prerequisites aren't met — e.g. a future
// session where the API server isn't running, or no AI provider key is configured.
export async function checkPrereqs(): Promise<Prereqs> {
  try {
    const res = await fetch(apiUrl('/config/status'), { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { reachable: false, aiConfigured: false };
    const data = await res.json();
    return { reachable: true, aiConfigured: Boolean(data.aiConfigured) };
  } catch {
    return { reachable: false, aiConfigured: false };
  }
}

export async function countUserResumes(userId = 'user-default'): Promise<number> {
  const res = await fetch(apiUrl(`/resumes?userId=${userId}`));
  if (!res.ok) throw new Error(`Failed to list resumes: ${res.status}`);
  const rows = await res.json();
  return rows.length;
}
