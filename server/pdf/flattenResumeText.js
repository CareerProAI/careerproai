// Flattened plain-text rendering of the same structured content, for the in-modal preview
// — derived directly from the AI's structured JSON, no extra AI call needed.
export function flattenResumeText(resumeContent, candidateName) {
  const lines = [candidateName || 'Candidate', '', 'PROFESSIONAL SUMMARY', resumeContent.summary || '', ''];
  lines.push('EXPERIENCE');
  (resumeContent.experience || []).forEach((exp) => {
    lines.push(`${exp.role || ''} — ${exp.company || ''} (${exp.dates || ''})`);
    (exp.bullets || []).forEach((bullet) => lines.push(`  • ${bullet}`));
    lines.push('');
  });
  lines.push('EDUCATION');
  (resumeContent.education || []).forEach((edu) => {
    lines.push(`${edu.degree || ''} — ${edu.institution || ''} (${edu.graduationYear || ''})`);
  });
  lines.push('', 'SKILLS', (resumeContent.skills || []).join(', '));
  return lines.join('\n');
}
