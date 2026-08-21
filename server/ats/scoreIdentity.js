import { DOB, NI_NUMBER, UK_PHONE, hasHeading } from './signals.js';

const UK_HEADINGS = ['professional profile', 'personal profile', 'professional summary', 'key skills', 'core skills', 'technical skills', 'professional experience', 'employment history', 'career history', 'education'];
const US_HEADINGS = ['objective', 'resume', 'work experience'];

export function scoreD3({ text }) {
  const t = String(text || '');
  const ukHits = UK_HEADINGS.filter((h) => t.toLowerCase().includes(h)).length;
  const hasExp = hasHeading(t, ['professional experience', 'employment history', 'work history', 'career history', 'work experience']);
  const hasEdu = hasHeading(t, ['education', 'qualifications']);
  const hasSkills = hasHeading(t, ['key skills', 'skills', 'core skills', 'technical skills']);
  if (!hasExp && !hasEdu && !hasSkills) return 0;
  if (!hasExp || !hasEdu || !hasSkills) return 4;
  if (US_HEADINGS.some((h) => t.toLowerCase().includes(h)) && ukHits < 3) return 8;
  return ukHits >= 3 ? 12 : 8;
}

export function scoreD4({ text }) {
  const t = String(text || '');
  const first = (t.split('\n').find((l) => l.trim()) || '').trim();
  if (/curriculum vitae/i.test(first) && !/[A-Z][a-z]+ [A-Z]/.test(first)) return 3;
  const email = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phone = UK_PHONE.test(t);
  const nameOk = /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+){1,3}$/.test(first);
  if (!email && !phone && !nameOk) return 0;
  if (!email || !phone) return 3;
  let score = nameOk && phone && email ? 10 : 6;
  if (/@(gmail|yahoo|hotmail|cool|123)/i.test(email[0]) && /\d{3,}/.test(email[0])) score = Math.min(score, 6);
  if (NI_NUMBER.test(t) || DOB.test(t)) score = Math.min(score, 6);
  return score;
}
