// One-off, re-runnable generator for the binary fixtures used by e2e/ and tests/api/.
// Run via `npm run fixtures:generate`. sample-resume.txt is hand-written (not generated)
// since it's already plain, readable text — see the sibling .txt file.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeText = fs.readFileSync(path.join(__dirname, 'sample-resume.txt'), 'utf-8');

// A real, valid multi-page PDF with extractable text (pdf-parse must be able to read it
// back out server-side) — mirrors the resume content in sample-resume.txt.
function generatePdf() {
  const doc = new PDFDocument({ margin: 50 });
  const outPath = path.join(__dirname, 'sample-resume.pdf');
  doc.pipe(fs.createWriteStream(outPath));
  doc.fontSize(10).font('Helvetica').text(resumeText, { lineGap: 2 });
  doc.end();
}

// A5MB+ junk file for A01 (oversized upload rejection) — only its size matters, content
// is irrelevant since multer's fileSize limit rejects it before any text extraction.
function generateOversizedFile() {
  const sixMb = 6 * 1024 * 1024;
  fs.writeFileSync(path.join(__dirname, 'oversized.bin'), Buffer.alloc(sixMb, 'x'));
}

// A minimal but genuinely valid 1x1 JPEG (real magic bytes/markers, not just a renamed
// .txt) for A02 (unsupported file type rejected) — must actually look like an image to
// exercise the real extension/mimetype branch in extractResumeText honestly.
function generateJpeg() {
  const base64 =
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  fs.writeFileSync(path.join(__dirname, 'not-a-resume.jpg'), Buffer.from(base64, 'base64'));
}

generatePdf();
generateOversizedFile();
generateJpeg();
console.log('Generated: sample-resume.pdf, oversized.bin, not-a-resume.jpg');
console.log('Run e2e/fixtures/generate_docx.py separately (python3) for sample-resume.docx.');
