import { renderPdfBuffer } from './renderPdfBuffer.js';

export function buildCoverLetterPdf(letterText, candidateName) {
  return renderPdfBuffer((doc) => {
    doc.fontSize(20).font('Helvetica-Bold').text(candidateName || 'Candidate');
    doc.moveDown(1.5);
    doc.fontSize(11).font('Helvetica').text(letterText || '', { align: 'left', lineGap: 4 });
  });
}
