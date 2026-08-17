import multer from 'multer';
import mammoth from 'mammoth';
import { ensurePdfJsDomPolyfills } from './pdfJsDomPolyfill.js';
import { ensurePdfWorker } from './ensurePdfWorker.js';
import {
  MAX_RESUME_BYTES,
  isAllowedResumeFile,
  isDocxResume,
  isPdfResume,
  isTxtResume,
  resumeExtension,
} from './resumeFileFilter.js';

const UNSUPPORTED = 'Please upload a PDF, DOCX, or TXT file.';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES },
  fileFilter(_req, file, cb) {
    if (isAllowedResumeFile(file)) cb(null, true);
    else cb(new Error(`Unsupported file type "${resumeExtension(file.originalname) || file.mimetype}". ${UNSUPPORTED}`));
  },
});

async function loadPdfParse() {
  ensurePdfJsDomPolyfills();
  await ensurePdfWorker();
  const { PDFParse } = await import('pdf-parse');
  return PDFParse;
}

function asBuffer(file) {
  return Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
}

async function extractPdf(file) {
  const PDFParse = await loadPdfParse();
  const parser = new PDFParse({ data: asBuffer(file) });
  try {
    return (await parser.getText()).text;
  } finally {
    await parser.destroy();
  }
}

async function extractDocx(file) {
  try {
    return (await mammoth.extractRawText({ buffer: asBuffer(file) })).value;
  } catch {
    throw new Error('Could not read this Word file. Save it as .docx (max 5MB) and try again.');
  }
}

export async function extractResumeText(file) {
  if (isPdfResume(file)) return extractPdf(file);
  if (isDocxResume(file)) return extractDocx(file);
  if (isTxtResume(file)) return asBuffer(file).toString('utf-8');
  throw new Error(`Unsupported file type "${resumeExtension(file.originalname) || file.mimetype}". ${UNSUPPORTED}`);
}
