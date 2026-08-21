import {
  DOB, INTEGRITY, NI_NUMBER, UK_PHONE, US_SPELLING, estimatedPages, hasRegistration, isRegulatedRole,
} from './signals.js';

/** Strategy: each cap is a ceiling; Template Method takes min(). */
export function collectCaps(ctx, dimensions) {
  const t = String(ctx.text || '');
  const caps = [100];
  if (INTEGRITY.test(t)) caps.push(40);
  const columns = /\t.+\t/.test(t);
  const tables = /\|.+\|/.test(t);
  const icons = /[☎✉★☑]/.test(t);
  if (columns && tables && icons) caps.push(45);
  if (/functional cv|skills-based/i.test(t) && !(t.match(/\b(19|20)\d{2}\b/g) || []).length) caps.push(55);
  if (isRegulatedRole(t, ctx.currentRole) && !hasRegistration(t) && dimensions.d7 <= 2) caps.push(68);
  const usCv = /\bresume\b/i.test(t) && /\bgpa\b/i.test(t) && US_SPELLING.test(t) && !UK_PHONE.test(t);
  if (usCv) caps.push(70);
  if (NI_NUMBER.test(t) || DOB.test(t) || /photo as header|headshot/i.test(t)) caps.push(75);
  if (estimatedPages(t) >= 4 && !/phd|professor|publication/i.test(t)) caps.push(80);
  return caps;
}
