import { hasHeading, hasRegistration, isRegulatedRole } from './signals.js';

export function scoreD7({ text, currentRole }) {
  const t = String(text || '');
  const regulated = isRegulatedRole(t, currentRole);
  if (regulated && !hasRegistration(t)) return 2;
  if (!hasHeading(t, ['education', 'qualifications', 'academic'])) {
    return hasHeading(t, ['certification', 'professional membership']) ? 5 : 0;
  }
  const classified = /\b(first|1st|2:1|2:2|third|distinction|merit)\b/i.test(t);
  const award = /\b(bsc|ba|beng|llb|msc|ma|mba|phd|gcse|a-levels|btec|hnc|hnd)\b/i.test(t);
  if (award && classified) return 8;
  if (award || classified) return 5;
  return 2;
}

export function scoreD8({ text }) {
  const t = String(text || '');
  const bullets = t.split(/\n/).filter((l) => /^\s*[-•]/.test(l));
  if (bullets.length === 0) return 0;
  const strong = bullets.filter((b) =>
    /\d/.test(b) && /\b(delivered|led|implemented|accountable|reduced|launched|managed)\b/i.test(b));
  const duties = bullets.filter((b) => /\b(responsible for|attended|helped the team)\b/i.test(b));
  if (strong.length >= Math.ceil(bullets.length * 0.5)) return 8;
  if (strong.length > 0 && duties.length > 0) return 5;
  if (duties.length === bullets.length) return 2;
  return strong.length ? 5 : 2;
}
