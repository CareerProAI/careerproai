import { sanitizeJobTextField } from '../server-utils.js';

const cap = (value, n) => sanitizeJobTextField(value).slice(0, n);

function joinSkills(skills) {
  return [...(skills?.frameworks || []), ...(skills?.tools || []), ...(skills?.softSkills || [])]
    .filter(Boolean)
    .slice(0, 24)
    .join(', ');
}

function formatExperience(experience) {
  return (experience || [])
    .slice(0, 6)
    .map((e) => {
      const bullets = (e.bullets || []).slice(0, 3).map((b) => cap(b, 180)).join('. ');
      return `${cap(e.role, 80)} at ${cap(e.company, 80)} (${cap(e.dates, 40)}): ${bullets}`;
    })
    .join('\n');
}

function formatEducation(education) {
  return (education || [])
    .slice(0, 4)
    .map((e) => `${cap(e.degree, 80)}, ${cap(e.institution, 80)} (${cap(e.graduationYear, 20)})`)
    .join('; ');
}

function formatProjects(projects) {
  return (projects || [])
    .slice(0, 4)
    .map((p) => {
      const techs = (p.technologies || []).slice(0, 8).join(', ');
      return `${cap(p.title, 80)}: ${cap(p.description, 180)}${techs ? ` [${techs}]` : ''}`;
    })
    .join('\n');
}

// Flattens the parsed upload (ResumeProfile) into the prompt block match-batch and
// job-compare send to the model — name/role alone produced generic identical scores.
export function buildResumeProfileSummary(profile = {}) {
  const certifications = (profile.certifications || []).slice(0, 6).map((c) => cap(c.name, 80)).join(', ');
  const languages = (profile.languages || [])
    .slice(0, 6)
    .map((l) => `${cap(l.name, 40)}${l.proficiency ? ` (${cap(l.proficiency, 30)})` : ''}`)
    .join(', ');

  return [
    `Name: ${cap(profile.candidateName, 80)}`,
    `Current Role: ${cap(profile.currentRole, 80)}`,
    `Target Role: ${cap(profile.gapAnalysis?.targetRole, 80)}`,
    `Skills: ${joinSkills(profile.skills)}`,
    `Experience:\n${formatExperience(profile.experience) || '(none listed)'}`,
    `Education: ${formatEducation(profile.education) || '(none listed)'}`,
    `Certifications: ${certifications || '(none listed)'}`,
    `Projects:\n${formatProjects(profile.projects) || '(none listed)'}`,
    `Languages: ${languages || '(none listed)'}`,
  ].join('\n');
}
