// Resume child tables covering certifications, projects, and languages.
export async function ensurePortfolioTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      name TEXT NOT NULL,
      institution TEXT,
      year TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL, -- JSON string array
      github_url TEXT,
      live_url TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS languages (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      name TEXT NOT NULL,
      proficiency TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);
}
