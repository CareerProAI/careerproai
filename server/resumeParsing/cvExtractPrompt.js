// Compact prompt for the Customised CV wizard — intentionally narrower than
// RESUME_PARSE_SYSTEM_PROMPT (no ATS scoring, strengths, improvements, gap analysis,
// certifications, projects, or languages). Fewer tokens → faster AI response.
// Output limits cap generation length, preventing Z.ai timeouts on verbose CVs.
export const CV_EXTRACT_PROMPT = `You are a CV parser. Extract key information and return ONLY valid JSON — no markdown, no commentary, no extra keys.

{
  "candidateName": "Full name",
  "currentRole": "Current or most recent job title",
  "contactInfo": { "email": "string|null", "phone": "string|null" },
  "experience": [{ "role": "string", "company": "string", "dates": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduationYear": "string" }],
  "skills": { "frameworks": ["string"], "tools": ["string"], "softSkills": ["string"] }
}

Limits: max 4 experience roles · max 3 bullets per role · max 2 education entries.`;
