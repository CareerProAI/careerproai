import { estimatedPages, hasHeading } from './signals.js';

export function scoreD1({ text, filename }) {
  const name = String(filename || '').toLowerCase();
  const generic = /(^|\/)(cv|resume|untitled|document)(\.(pdf|docx|txt))?$/.test(name)
    || name === 'cv.pdf' || name.includes('resume.pdf');
  const sensible = /cv\.(pdf|docx|txt)$/i.test(name) && /[a-z][-_ ][a-z]/i.test(name);
  const hyphenBreaks = (String(text).match(/[A-Za-z]-(\r?\n)/g) || []).length;
  if (!String(text).trim()) return 0;
  const avg = String(text).length / Math.max(1, text.trim().split(/\s+/).length);
  if (avg < 3.2) return 6;
  if (generic || hyphenBreaks > 8) return 12;
  return sensible ? 18 : 12;
}

export function scoreD2({ text }) {
  const t = String(text || '');
  if (/infographic|skill bars?|★★+|█{3,}/i.test(t)) return /infographic/i.test(t) ? 0 : 4;
  if (/\t.+\t/.test(t) && /experience|employment/i.test(t)) return 0;
  let score = 14;
  if ((t.match(/ · | \| /g) || []).length > 20) score = 9;
  if (estimatedPages(t) >= 3 && !/phd|professor|publication/i.test(t)) score = Math.min(score, 9);
  if (hasHeading(t, ['work experience']) && !hasHeading(t, ['professional experience', 'employment history'])) {
    score = Math.min(score, 14);
  }
  return score;
}
