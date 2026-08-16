import { insertResumeCore } from './insertResumeCore.js';
import { insertResumeDetails } from './insertResumeDetails.js';
import { normalizeParsedResume } from './normalizeParsedResume.js';

// Wraps the multi-table insert in BEGIN TRANSACTION / COMMIT / ROLLBACK — preserve this
// if extending it. Returns the generated resumeId on success.
export async function insertParsedResume(db, { activeUserId, filename, parsedData }) {
  const resumeId = `res-${Date.now()}`;
  const timestampStr = new Date().toLocaleString();
  const data = normalizeParsedResume(parsedData);

  await db.exec('BEGIN TRANSACTION');
  try {
    await insertResumeCore(db, resumeId, activeUserId, filename, data, timestampStr);
    await insertResumeDetails(db, resumeId, data);
    await db.exec('COMMIT');
  } catch (dbErr) {
    await db.exec('ROLLBACK');
    throw dbErr;
  }

  return resumeId;
}
