// Steps 4-9 of the parsed-resume insert: experience, education, certifications,
// projects, languages, and analysis insights. Each per-array-item insert is awaited via
// Promise.all so a failure actually propagates to insertParsedResume.js's try/catch
// (triggering ROLLBACK) and this function can't return before every row has actually
// been written — the previous `.forEach(async ...)` form did neither: forEach doesn't
// await its callback, so the function returned early and any insert failure became an
// unhandled promise rejection that silently skipped ROLLBACK.
export async function insertResumeDetails(db, resumeId, parsedData) {
  // 4. Insert experience
  const experienceList = parsedData.experience || [];
  await Promise.all(experienceList.map((exp, idx) =>
    db.run(
      `INSERT INTO experience (id, resume_id, role, company, dates, bullets)
       VALUES (?, ?, ?, ?, ?, ?)`,
      `exp-${Date.now()}-${idx}`,
      resumeId,
      exp.role,
      exp.company,
      exp.dates,
      JSON.stringify(exp.bullets || [])
    )
  ));

  // 5. Insert education
  const educationList = parsedData.education || [];
  await Promise.all(educationList.map((edu, idx) =>
    db.run(
      `INSERT INTO education (id, resume_id, degree, institution, graduation_year)
       VALUES (?, ?, ?, ?, ?)`,
      `edu-${Date.now()}-${idx}`,
      resumeId,
      edu.degree,
      edu.institution,
      edu.graduationYear
    )
  ));

  // 6. Insert certifications
  const certList = parsedData.certifications || [];
  await Promise.all(certList.map((cert, idx) =>
    db.run(
      `INSERT INTO certifications (id, resume_id, name, institution, year)
       VALUES (?, ?, ?, ?, ?)`,
      `cert-${Date.now()}-${idx}`,
      resumeId,
      cert.name,
      cert.institution,
      cert.year
    )
  ));

  // 7. Insert projects
  const projectList = parsedData.projects || [];
  await Promise.all(projectList.map((proj, idx) =>
    db.run(
      `INSERT INTO projects (id, resume_id, title, description, technologies, github_url, live_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      `proj-${Date.now()}-${idx}`,
      resumeId,
      proj.title,
      proj.description,
      JSON.stringify(proj.technologies || []),
      proj.githubUrl,
      proj.liveUrl
    )
  ));

  // 8. Insert languages
  const langList = parsedData.languages || [];
  await Promise.all(langList.map((lang, idx) =>
    db.run(
      'INSERT INTO languages (id, resume_id, name, proficiency) VALUES (?, ?, ?, ?)',
      `lang-${Date.now()}-${idx}`,
      resumeId,
      lang.name,
      lang.proficiency
    )
  ));

  // 9. Insert analysis insights
  const strengths = parsedData.strengths || [];
  const improvements = parsedData.improvements || [];

  // Inject unique IDs
  const strengthsWithIds = strengths.map((s, i) => ({ ...s, id: `str-${Date.now()}-${i}` }));
  const improvementsWithIds = improvements.map((im, i) => ({ ...im, id: `imp-${Date.now()}-${i}` }));

  await db.run(
    'INSERT INTO resume_analysis (resume_id, strengths, improvements, target_role, missing_skills) VALUES (?, ?, ?, ?, ?)',
    resumeId,
    JSON.stringify(strengthsWithIds),
    JSON.stringify(improvementsWithIds),
    parsedData.gapAnalysis?.targetRole || parsedData.currentRole || '',
    JSON.stringify(parsedData.gapAnalysis?.missingSkills || []),
  );
}
