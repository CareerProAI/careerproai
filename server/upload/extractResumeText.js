import path from 'path';
import multer from 'multer';
import mammoth from 'mammoth';
import { ensurePdfJsDomPolyfills } from './pdfJsDomPolyfill.js';
import { ensurePdfWorker } from './ensurePdfWorker.js';

// In-memory upload handling for resume files (PDF/DOCX/TXT) — max 5MB, matches the upload UI's stated limit
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

async function loadPdfParse() {
  ensurePdfJsDomPolyfills();
  await ensurePdfWorker();
  const { PDFParse } = await import('pdf-parse');
  return PDFParse;
}

// Extracts raw text from an uploaded resume file, branching by extension/MIME type
export async function extractResumeText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.pdf' || file.mimetype === 'application/pdf') {
    const PDFParse = await loadPdfParse();
    const parser = new PDFParse({ data: file.buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (ext === '.docx' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (ext === '.txt' || file.mimetype === 'text/plain') {
    return file.buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type "${ext || file.mimetype}". Please upload a PDF, DOCX, or TXT file.`);
}
