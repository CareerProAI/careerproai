export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['.pdf', '.docx', '.txt'];

export function validateResumeFile(file: { name: string; size: number }): string | null {
  const lower = file.name.toLowerCase();
  if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
    return 'Please upload a PDF or DOCX file (max 5MB). TXT is also accepted.';
  }
  if (file.size > MAX_RESUME_BYTES) {
    return 'Resume must be 5MB or smaller.';
  }
  return null;
}
