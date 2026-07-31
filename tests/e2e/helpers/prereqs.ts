// Shared prerequisite check for specs that need a real AI call to complete (resume
// upload, save+compare). Specs call this and skip cleanly rather than fail when no AI
// provider is configured — mirrors tests/api/helpers/http.ts's checkPrereqs.
export const API_BASE = 'http://localhost:3001/api';

// Seeds a resume directly through the real API (not the UI) — used by specs like
// profile-switching where the thing under test is switching, not the upload flow
// itself (already covered by resume-upload.spec.ts), so seeding via API is faster and
// avoids duplicating the same upload interaction twice per test.
export async function seedResume(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);
  form.append('userId', 'user-default');
  const res = await fetch(`${API_BASE}/resumes/parse`, { method: 'POST', body: form });
  const body = await res.json();
  if (!res.ok) throw new Error(`seedResume failed: ${JSON.stringify(body)}`);
  return body.resumeId;
}

export async function isAiConfigured(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/config/status`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.aiConfigured);
  } catch {
    return false;
  }
}

// Cleans up a profile created by an upload spec, so repeated E2E runs never accumulate
// test resumes in the user's real talentai.db.
export async function deleteResume(resumeId: string): Promise<void> {
  await fetch(`${API_BASE}/resumes/${resumeId}`, { method: 'DELETE' });
}

export async function listResumeIds(userId = 'user-default'): Promise<string[]> {
  const res = await fetch(`${API_BASE}/resumes?userId=${userId}`);
  const rows = await res.json();
  return rows.map((r: { id: string }) => r.id);
}
