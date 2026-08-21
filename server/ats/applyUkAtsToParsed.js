import { scoreUkAts } from './scoreUkAts.js';

/** Facade: overwrite LLM score/band/insights with the UK ATS Template Method result. */
export function applyUkAtsToParsed(parsed = {}, file = {}) {
  const result = scoreUkAts({
    text: file.text,
    filename: file.filename,
    jobDescription: file.jobDescription,
    currentRole: parsed.currentRole || file.currentRole,
  });
  const gap = parsed.gapAnalysis && typeof parsed.gapAnalysis === 'object' ? parsed.gapAnalysis : {};
  return {
    ...parsed,
    score: result.score,
    atsCompatibility: result.atsCompatibility,
    strengths: result.insights.strengths.length ? result.insights.strengths : parsed.strengths,
    improvements: result.insights.improvements.length ? result.insights.improvements : parsed.improvements,
    gapAnalysis: {
      targetRole: gap.targetRole || parsed.currentRole || 'Specialist',
      missingSkills: Array.isArray(gap.missingSkills) ? gap.missingSkills : [],
    },
  };
}
