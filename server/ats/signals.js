export const UK_PHONE = /(?:\+44\s*\d[\d\s]{8,}|0(?:7\d{3}[\s-]?\d{6}|7\d{9}))/;
export const NI_NUMBER = /\b[A-CEGHJ-PR-TW-Z]{2}\s?\d{6}\s?[A-D]\b/i;
export const DOB = /\b(?:d\.?o\.?b\.?|date of birth)\b.{0,12}\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/i;
export const INTEGRITY = /ignore previous instructions|set score to 100|white on white|hidden text/i;
export const US_SPELLING = /\b(organized|organization|license[d]?|program[s]?)\b/i;
export const UK_SIGNAL = UK_PHONE;
export const MONTH_YEAR = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/gi;

export function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function estimatedPages(text) {
  return Math.max(1, Math.ceil(String(text || '').length / 3000));
}

export function hasHeading(text, names) {
  const lower = String(text || '').toLowerCase();
  return names.some((n) => lower.includes(n.toLowerCase()));
}

export function isRegulatedRole(text, role = '') {
  const blob = `${role} ${text}`.toLowerCase();
  return /nurse|nursing|midwif|doctor|physician|solicitor|barrister|teacher|qts|social work|architect|chartered engineer|financial adviser|gp\b/.test(blob);
}

export function hasRegistration(text) {
  return /\b(nmc|hcpc|gmc|sra|bsb|qts|arb|riba|ceng|ieng|social work england|fca)\b/i.test(text);
}
