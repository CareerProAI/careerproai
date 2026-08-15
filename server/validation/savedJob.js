function requireString(value, fieldName, maxLen = 200) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return `${fieldName} must be a non-empty string.`;
  }
  if (value.length > maxLen) return `${fieldName} must be ${maxLen} characters or fewer.`;
  return null;
}

// Guard: resumeId/jobId strings + integer matchRate in [0, 100] (rejects strings/floats).
export function validateSavedJobPost({ resumeId, jobId, matchRate }) {
  const resumeIdErr = requireString(resumeId, 'resumeId', 200);
  if (resumeIdErr) return resumeIdErr;
  const jobIdErr = requireString(jobId, 'jobId', 200);
  if (jobIdErr) return jobIdErr;
  if (typeof matchRate !== 'number' || !Number.isInteger(matchRate) || matchRate < 0 || matchRate > 100) {
    return 'matchRate must be an integer between 0 and 100.';
  }
  return null;
}

export function capNotes(notes) {
  return (notes || '').toString().slice(0, 2000);
}
