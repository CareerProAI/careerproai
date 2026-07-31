import { ResumeProfile } from '../types';

export function addSkillToProfile(profile: ResumeProfile, skill: string): ResumeProfile {
  return {
    ...profile,
    score: Math.min(100, profile.score + 3),
    skills: { ...profile.skills, frameworks: [...profile.skills.frameworks, skill] },
    gapAnalysis: {
      ...profile.gapAnalysis,
      missingSkills: profile.gapAnalysis.missingSkills.filter((s) => s !== skill),
    },
  };
}

export function mergeProfileUpdate(profile: ResumeProfile, updated: Partial<ResumeProfile>): ResumeProfile {
  return {
    ...profile,
    candidateName: updated.candidateName || profile.candidateName,
    currentRole: updated.currentRole || profile.currentRole,
    gapAnalysis: {
      ...profile.gapAnalysis,
      targetRole: updated.gapAnalysis?.targetRole || profile.gapAnalysis.targetRole,
    },
  };
}
