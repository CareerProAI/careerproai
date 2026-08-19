import { loadResumeProfile } from './loadResumeProfile.js';

/**
 * Batch-load every resume for a user in parallel.
 * One HTTP request from the client replaces the previous 1+N pattern
 * (list fetch + N individual detail fetches). All per-profile DB queries
 * still fire concurrently via Promise.all inside loadResumeProfile.
 */
export async function loadAllProfiles(db, userId) {
  const rows = await db.all(
    'SELECT id FROM resumes WHERE user_id = ? ORDER BY id DESC',
    userId
  );
  // Parallel: every profile's 8 child-table queries run at the same time.
  return Promise.all(rows.map((r) => loadResumeProfile(db, r.id)));
}
