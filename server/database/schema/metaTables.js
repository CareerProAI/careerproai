// social_links + resume_analysis (1:1 insight data), and job_matches (saved jobs).
export async function ensureMetaTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT NOT NULL,
      platform TEXT NOT NULL, -- 'linkedin', 'github', 'portfolio'
      url TEXT NOT NULL,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS resume_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT NOT NULL UNIQUE,
      strengths TEXT NOT NULL, -- JSON string representation of StrengthItem[]
      improvements TEXT NOT NULL, -- JSON string representation of ImprovementItem[]
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS job_matches (
      id TEXT PRIMARY KEY,
      resume_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      match_rate INTEGER DEFAULT 0,
      why_matches TEXT,
      missing_skills TEXT, -- JSON string array
      resume_improvements TEXT, -- JSON string array
      saved_at TEXT,
      notes TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `);
}
