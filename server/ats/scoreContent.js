import { INTEGRITY, MONTH_YEAR, hasHeading } from './signals.js';

const GENERIC = /^(communication|teamwork|hard working|motivated|microsoft office)$/i;

export function scoreD5({ text, jobDescription }) {
  const t = String(text || '');
  if (INTEGRITY.test(t)) return 0;
  if (String(jobDescription || '').trim()) return scoreD5b(t, jobDescription);
  return scoreD5a(t);
}

function skillPhrases(text) {
  const block = text.split(/key skills|core skills|technical skills|skills/i)[1] || '';
  const cut = block.split(/professional experience|employment history|education/i)[0] || '';
  return cut.split(/[·|,;\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
}

function scoreD5a(text) {
  if (!hasHeading(text, ['key skills', 'skills', 'core skills', 'technical skills'])) {
    return /\b(python|sql|java|react|nmc)\b/i.test(text) ? 6 : 0;
  }
  const skills = skillPhrases(text);
  if (skills.length === 0) return 6;
  if (skills.length > 40 || skills.every((s) => GENERIC.test(s))) return 11;
  const evidenced = skills.filter((s) => text.toLowerCase().includes(s.toLowerCase()) && text.split(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig')).length > 2);
  if (skills.length >= 8 && skills.length <= 16 && evidenced.length >= 2) return 16;
  return 11;
}

function scoreD5b(text, jd) {
  const lines = String(jd).split(/\n|•|- /).map((l) => l.trim()).filter((l) => l.length > 8).slice(0, 8);
  if (lines.length === 0) return scoreD5a(text);
  const hits = lines.filter((l) => text.toLowerCase().includes(l.slice(0, 24).toLowerCase()));
  const ratio = hits.length / lines.length;
  if (ratio >= 0.85) return 16;
  if (ratio >= 0.5) return 11;
  if (ratio > 0) return 6;
  return 0;
}

export function scoreD6({ text }) {
  const t = String(text || '');
  if (!hasHeading(t, ['professional experience', 'employment history', 'work history', 'career history', 'work experience'])) return 0;
  const months = t.match(MONTH_YEAR) || [];
  if (months.length >= 2 && /present/i.test(t)) return 14;
  if (months.length >= 1) return 11;
  if (/\b(19|20)\d{2}\s*[–-]\s*((?:19|20)\d{2}|present)\b/i.test(t)) return 9;
  if (/career history|skills-based/i.test(t) && months.length === 0) return 4;
  return 4;
}
