// Default 30s per provider — raised from 20s to survive larger prompts (resume parsing,
// full-page job descriptions). Vercel maxDuration is 60s; worst-case three sequential
// timeouts (30+30+30) = 90s, but rate-limit failures cascade in <1s so Z.ai nearly always
// gets its full budget when Groq/Gemini rate-limit rather than timeout.
export const AI_FETCH_TIMEOUT_MS = 30_000;
export const GROQ_TIMEOUT_MS = 30_000;
export const GEMINI_TIMEOUT_MS = 30_000;

/** Strategy: every AI HTTP call must fail fast so Vercel maxDuration can still fall back. */
export async function timedFetch(url, init = {}, timeoutMs = AI_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(`AI provider timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
