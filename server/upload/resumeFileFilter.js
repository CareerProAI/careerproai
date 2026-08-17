import path from 'path';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const ALLOWED_EXT = new Set(['.pdf', '.docx', '.txt']);

export const PDF_MIME = 'application/pdf';
export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const MSWORD_MIME = 'application/msword';
export const TXT_MIME = 'text/plain';

export const ALLOWED_MIME = new Set([PDF_MIME, DOCX_MIME, MSWORD_MIME, TXT_MIME]);

export function resumeExtension(originalname) {
  return path.extname(originalname || '').toLowerCase();
}

export function resumeMime(file) {
  return (file.mimetype || file.type || '').toLowerCase();
}

export function isAllowedResumeFile(file) {
  const ext = resumeExtension(file.originalname || file.name);
  return ALLOWED_EXT.has(ext) || ALLOWED_MIME.has(resumeMime(file));
}

export function isPdfResume(file) {
  return resumeExtension(file.originalname) === '.pdf' || resumeMime(file) === PDF_MIME;
}

export function isDocxResume(file) {
  const ext = resumeExtension(file.originalname);
  const mime = resumeMime(file);
  return ext === '.docx' || mime === DOCX_MIME || mime === MSWORD_MIME;
}

export function isTxtResume(file) {
  return resumeExtension(file.originalname) === '.txt' || resumeMime(file) === TXT_MIME;
}
