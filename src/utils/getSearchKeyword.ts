import { ResumeProfile } from '../types';

// currentRole sometimes carries a trailing employer suffix (e.g. "Data Scientist – ACI",
// copied verbatim from how the candidate wrote it on their resume) — sending that whole
// string upstream as a search keyword would over-narrow the match to that employer name.
// Strip anything after the first " – ", " - ", " at ", or " @ " separator to keep just the
// role title.
const ROLE_SUFFIX_SEPARATOR = /\s+(?:–|-|at|@)\s+/;

export function getSearchKeyword(profile: ResumeProfile): string {
  const role = profile.currentRole || profile.gapAnalysis?.targetRole || '';
  return role.split(ROLE_SUFFIX_SEPARATOR)[0].trim();
}
