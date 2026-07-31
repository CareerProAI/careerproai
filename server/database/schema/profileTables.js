// Resume child tables covering skills and work/education history.
export async function ensureProfileTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resume_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT NOT NULL,
      skill_name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'frameworks', 'tools', 'softSkills'
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS experience (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      dates TEXT NOT NULL,
      bullets TEXT NOT NULL, -- JSON string array
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS education (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      graduation_year TEXT NOT NULL,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);
}
