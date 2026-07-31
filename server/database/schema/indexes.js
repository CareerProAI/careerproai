// SQLite does not auto-index foreign-key columns — every child-table query in
// routes/resumes.js and routes/savedJobs.js filters by resume_id, so without these the
// planner does a full table scan per lookup. Invisible at today's single-user scale, but
// cheap and safe to add now rather than the moment real multi-user volume shows up.
// resume_analysis.resume_id is UNIQUE, which SQLite already indexes implicitly — no
// explicit index needed there.
export async function ensureIndexes(db) {
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
    CREATE INDEX IF NOT EXISTS idx_resume_skills_resume_id ON resume_skills(resume_id);
    CREATE INDEX IF NOT EXISTS idx_experience_resume_id ON experience(resume_id);
    CREATE INDEX IF NOT EXISTS idx_education_resume_id ON education(resume_id);
    CREATE INDEX IF NOT EXISTS idx_certifications_resume_id ON certifications(resume_id);
    CREATE INDEX IF NOT EXISTS idx_projects_resume_id ON projects(resume_id);
    CREATE INDEX IF NOT EXISTS idx_languages_resume_id ON languages(resume_id);
    CREATE INDEX IF NOT EXISTS idx_social_links_resume_id ON social_links(resume_id);
    CREATE INDEX IF NOT EXISTS idx_job_matches_resume_id ON job_matches(resume_id);
  `);
}
