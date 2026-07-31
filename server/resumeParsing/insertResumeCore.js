// Steps 1-3 of the parsed-resume insert: the resumes row itself, contactInfo ->
// social_links, and skills -> resume_skills. Split from insertResumeDetails.js purely to
// stay under the 100-line-per-file limit — both run inside the same transaction from
// insertParsedResume.js.
export async function insertResumeCore(db, resumeId, activeUserId, filename, parsedData, timestampStr) {
  // 1. Insert into Resumes
  await db.run(
    `INSERT INTO resumes (id, user_id, filename, candidate_name, current_role, score, ats_compatibility, last_analyzed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    resumeId,
    activeUserId,
    filename || 'uploaded_resume.txt',
    parsedData.candidateName || 'Unknown Candidate',
    parsedData.currentRole || 'Software Professional',
    parsedData.score || 70,
    parsedData.atsCompatibility || 'Good ATS Compatibility',
    timestampStr
  );

  // 2. Insert into social_links / contactInfo — independent rows, inserted in parallel
  const contactInfo = parsedData.contactInfo || {};
  await Promise.all(
    Object.entries(contactInfo)
      .filter(([, url]) => url)
      .map(([platform, url]) => db.run(
        'INSERT INTO social_links (resume_id, platform, url) VALUES (?, ?, ?)',
        resumeId,
        platform,
        url
      ))
  );

  // 3. Insert skills — independent rows, inserted in parallel
  const skills = parsedData.skills || {};
  const skillInserts = Object.entries(skills).flatMap(([category, skillList]) =>
    Array.isArray(skillList)
      ? skillList.map((skillName) => db.run(
          'INSERT INTO resume_skills (resume_id, skill_name, category) VALUES (?, ?, ?)',
          resumeId,
          skillName,
          category
        ))
      : []
  );
  await Promise.all(skillInserts);
}
