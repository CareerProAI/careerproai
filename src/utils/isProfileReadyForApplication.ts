import { ResumeProfile } from '../types';

// A tailored resume is only worth generating if there is real experience/contact
// data to tailor from — otherwise the model has nothing to work with beyond the JD.
export function isProfileReadyForApplication(
  profile: ResumeProfile | null,
): profile is ResumeProfile {
  return Boolean(profile?.contactInfo?.email) && (profile?.experience.length || 0) > 0;
}
