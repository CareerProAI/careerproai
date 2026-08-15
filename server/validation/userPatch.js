// Strategy map: each PATCH field knows its column and how to coerce for SQLite.
export const USER_PATCH_FIELDS = {
  name: { column: 'name', toDb: (v) => v.trim() },
  email: { column: 'email', toDb: (v) => v.trim() },
  apiKeyLabel: { column: 'api_key_label', toDb: (v) => v || '' },
  notifyJobMatches: { column: 'notify_job_matches', toDb: (v) => (v ? 1 : 0) },
  notifyResumeAnalysis: { column: 'notify_resume_analysis', toDb: (v) => (v ? 1 : 0) },
  notifyWeeklySummary: { column: 'notify_weekly_summary', toDb: (v) => (v ? 1 : 0) },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_MAX_LENGTHS = { name: 100, email: 254, apiKeyLabel: 100 };

export function validateUserPatch(body) {
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) return 'Name cannot be empty.';
    if (body.name.trim().length > FIELD_MAX_LENGTHS.name) {
      return `Name must be ${FIELD_MAX_LENGTHS.name} characters or fewer.`;
    }
  }
  if (body.email !== undefined) {
    if (typeof body.email !== 'string' || !EMAIL_PATTERN.test(body.email.trim())) {
      return 'A valid email address is required.';
    }
    if (body.email.trim().length > FIELD_MAX_LENGTHS.email) {
      return `Email must be ${FIELD_MAX_LENGTHS.email} characters or fewer.`;
    }
  }
  if (body.apiKeyLabel !== undefined) {
    const label = body.apiKeyLabel || '';
    if (label.length > FIELD_MAX_LENGTHS.apiKeyLabel) {
      return `API key label must be ${FIELD_MAX_LENGTHS.apiKeyLabel} characters or fewer.`;
    }
  }
  return null;
}
