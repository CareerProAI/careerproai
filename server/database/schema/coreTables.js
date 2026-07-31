// The two parent tables: users, and resumes (which references users.id).
export async function ensureCoreTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      api_key_label TEXT,
      notify_job_matches INTEGER DEFAULT 1,
      notify_resume_analysis INTEGER DEFAULT 1,
      notify_weekly_summary INTEGER DEFAULT 0
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      candidate_name TEXT,
      current_role TEXT,
      score INTEGER DEFAULT 0,
      ats_compatibility TEXT,
      last_analyzed TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}
