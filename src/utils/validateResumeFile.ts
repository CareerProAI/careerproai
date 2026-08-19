export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['.pdf', '.docx', '.txt'];
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
]);

export function validateResumeFile(file: { name: string; size: number; type?: string }): string | null {
  const lower = (file.name || '').toLowerCase();
  const mime = (file.type || '').toLowerCase();
  if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext)) && !ALLOWED_MIME.has(mime)) {
    return 'Please upload a PDF or DOCX file (max 5MB). TXT is also accepted.';
  }
  if (file.size > MAX_RESUME_BYTES) {
    return 'CV must be 5MB or smaller.';
  }
  return null;
}
