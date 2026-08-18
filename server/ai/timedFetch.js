export const AI_FETCH_TIMEOUT_MS = 20_000;

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
