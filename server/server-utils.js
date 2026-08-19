// Pure, side-effect-free helpers extracted out of server.js so they can be
// unit-tested directly (tests/api/) without importing server.js itself — server.js
// calls app.listen()/initDb() at module scope, so importing it would try to bind
// the real port and open a second DB connection. Nothing here touches the network,
// the filesystem, or Express; each function is a straight input -> output transform.

const MAX_JOB_TEXT_FIELD_LENGTH = 600;

// Strips HTML/markup and caps length on a single job text field. `jobs[].description`
// et al. originate from external, untrusted sources (Bdjobs.com, LinkedIn) — this keeps
// that content inert as plain text data before it's embedded in an AI prompt.
export function sanitizeJobTextField(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_JOB_TEXT_FIELD_LENGTH);
}

export function clampMatchRate(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), 100);
}

// Validates/coerces one AI-returned match entry so a manipulated or malformed
// model response can't hand the client an unexpected shape or out-of-range value.
export function sanitizeMatchEntry(entry, validIds) {
  if (!entry || typeof entry.id !== 'string' || !validIds.has(entry.id)) return null;
  const skills = Array.isArray(entry.skills) ? entry.skills.filter((s) => typeof s === 'string').slice(0, 6) : [];
  return {
    id: entry.id,
    matchRate: clampMatchRate(entry.matchRate),
    whyMatches: typeof entry.whyMatches === 'string' ? entry.whyMatches.slice(0, 500) : '',
    skills,
  };
}

// Route handlers use this to decide whether "rate-limited, try again later" is
// actually true — a Groq 429 alone doesn't mean that, since Gemini's fallback
// failure could be an unrelated cause (bad key, malformed response, network error)
// that a plain retry will never fix.
export function computeAllRateLimited(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.every((msg) => /API Error \(429\)/.test(String(msg)));
}

export function computeBothRateLimited(groqMessage, geminiMessage) {
  return computeAllRateLimited([groqMessage, geminiMessage]);
}
