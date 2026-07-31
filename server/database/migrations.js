// Additive-only ALTER TABLE migrations for columns added after a table's original
// CREATE TABLE IF NOT EXISTS — that statement is a no-op against an already-created
// table, so new columns on existing tables must be applied this way: check
// PRAGMA table_info(<table>) for the column, then ALTER TABLE ... ADD COLUMN if missing.
// Safe to run after createSchema() regardless of statement order relative to individual
// table creation, since by then every table already exists.
export async function runMigrations(db) {
  const usersColumns = await db.all('PRAGMA table_info(users)');
  const usersColumnNames = usersColumns.map((col) => col.name);
  if (!usersColumnNames.includes('api_key_label')) {
    await db.exec('ALTER TABLE users ADD COLUMN api_key_label TEXT');
  }
  if (!usersColumnNames.includes('notify_job_matches')) {
    await db.exec('ALTER TABLE users ADD COLUMN notify_job_matches INTEGER DEFAULT 1');
  }
  if (!usersColumnNames.includes('notify_resume_analysis')) {
    await db.exec('ALTER TABLE users ADD COLUMN notify_resume_analysis INTEGER DEFAULT 1');
  }
  if (!usersColumnNames.includes('notify_weekly_summary')) {
    await db.exec('ALTER TABLE users ADD COLUMN notify_weekly_summary INTEGER DEFAULT 0');
  }

  const jobMatchesColumns = await db.all('PRAGMA table_info(job_matches)');
  const jobMatchesColumnNames = jobMatchesColumns.map((col) => col.name);
  if (!jobMatchesColumnNames.includes('saved_at')) {
    await db.exec('ALTER TABLE job_matches ADD COLUMN saved_at TEXT');
  }
  if (!jobMatchesColumnNames.includes('notes')) {
    await db.exec('ALTER TABLE job_matches ADD COLUMN notes TEXT');
  }
}
