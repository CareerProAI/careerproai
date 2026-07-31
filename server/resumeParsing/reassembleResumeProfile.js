// Reassembles the full ResumeProfile shape (matching src/types/resume.ts) from the
// normalized tables' raw rows — the mapping to reference when the frontend type and SQL
// schema need to stay in sync. Pure function: no DB access, just formatting.
export function reassembleResumeProfile(resume, { skills, experience, education, certifications, projects, languages, socialLinks, analysis }) {
  const formattedExperience = experience.map((exp) => ({
    ...exp,
    bullets: JSON.parse(exp.bullets)
  }));

  const formattedProjects = projects.map((proj) => ({
    ...proj,
    technologies: JSON.parse(proj.technologies)
  }));

  const formattedSkills = {
    frameworks: skills.filter(s => s.category === 'frameworks').map(s => s.skill_name),
    tools: skills.filter(s => s.category === 'tools').map(s => s.skill_name),
    softSkills: skills.filter(s => s.category === 'softSkills').map(s => s.skill_name)
  };

  const gapAnalysis = {
    targetRole: resume.current_role ? `Lead ${resume.current_role}` : 'Specialist',
    missingSkills: []
  };

  let strengths = [];
  let improvements = [];
  if (analysis) {
    strengths = JSON.parse(analysis.strengths);
    improvements = JSON.parse(analysis.improvements);

    // Infer missing skills from improvements & strengths
    const parsedImprovements = improvements.map(i => i.title.toLowerCase());
    if (parsedImprovements.some(i => i.includes('cloud') || i.includes('aws'))) {
      gapAnalysis.missingSkills.push('AWS / GCP Cloud');
    }
    if (parsedImprovements.some(i => i.includes('system design') || i.includes('architecture'))) {
      gapAnalysis.missingSkills.push('System Architecture');
    }
    if (parsedImprovements.some(i => i.includes('ci/cd') || i.includes('pipeline'))) {
      gapAnalysis.missingSkills.push('CI/CD Pipelines');
    }
  }

  return {
    id: resume.id,
    fileName: resume.filename,
    candidateName: resume.candidate_name,
    currentRole: resume.current_role,
    score: resume.score,
    atsCompatibility: resume.ats_compatibility,
    lastAnalyzed: resume.last_analyzed,
    contactInfo: {
      email: socialLinks.find(s => s.platform === 'email')?.url || null,
      phone: socialLinks.find(s => s.platform === 'phone')?.url || null,
      address: socialLinks.find(s => s.platform === 'address')?.url || null,
      linkedin: socialLinks.find(s => s.platform === 'linkedin')?.url || null,
      github: socialLinks.find(s => s.platform === 'github')?.url || null,
      portfolio: socialLinks.find(s => s.platform === 'portfolio')?.url || null
    },
    experience: formattedExperience,
    education: education.map(edu => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      graduationYear: edu.graduation_year
    })),
    certifications: certifications.map(cert => ({
      id: cert.id,
      name: cert.name,
      institution: cert.institution,
      year: cert.year
    })),
    projects: formattedProjects,
    languages: languages.map(lang => ({
      id: lang.id,
      name: lang.name,
      proficiency: lang.proficiency
    })),
    skills: formattedSkills,
    strengths,
    improvements,
    gapAnalysis
  };
}
