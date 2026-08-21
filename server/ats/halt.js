const MONTH_YEAR = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i;
const YEAR_SPAN = /\b(19|20)\d{2}\s*[–-]\s*((?:19|20)\d{2}|present)\b/i;

/** Template-method gate: empty vs fragmentary extract. */
export function haltScore(text) {
  const t = String(text || '').trim();
  if (!t) return { halt: true, score: 0 };
  const words = t.split(/\s+/).filter(Boolean);
  const hasDate = MONTH_YEAR.test(t) || YEAR_SPAN.test(t);
  const hasEmail = /@/.test(t);
  const hasName = /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+){1,3}\s*$/m.test(t.split('\n')[0] || '');
  const reconstructable = (hasName && hasDate) || (hasEmail && hasDate);
  if (words.length < 25 && !reconstructable) return { halt: true, score: 35 };
  return null;
}
