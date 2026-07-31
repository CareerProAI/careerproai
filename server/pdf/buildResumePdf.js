import { renderPdfBuffer } from './renderPdfBuffer.js';

export function buildResumePdf(resumeContent, contactInfo, candidateName) {
  return renderPdfBuffer((doc) => {
    doc.fontSize(20).font('Helvetica-Bold').text(candidateName || 'Candidate');
    const contactLine = [contactInfo?.email, contactInfo?.phone, contactInfo?.address, contactInfo?.linkedin, contactInfo?.portfolio]
      .filter(Boolean).join('  |  ');
    if (contactLine) doc.fontSize(9).font('Helvetica').fillColor('#555').text(contactLine);
    doc.fillColor('#000').moveDown(1);

    doc.fontSize(13).font('Helvetica-Bold').text('Professional Summary');
    doc.fontSize(10).font('Helvetica').text(resumeContent.summary || '');
    doc.moveDown(1);

    doc.fontSize(13).font('Helvetica-Bold').text('Experience');
    (resumeContent.experience || []).forEach((exp) => {
      doc.fontSize(11).font('Helvetica-Bold').text(`${exp.role || ''} — ${exp.company || ''}`);
      if (exp.dates) doc.fontSize(9).font('Helvetica').fillColor('#555').text(exp.dates).fillColor('#000');
      (exp.bullets || []).forEach((bullet) => doc.fontSize(10).font('Helvetica').text(`•  ${bullet}`));
      doc.moveDown(0.6);
    });

    doc.fontSize(13).font('Helvetica-Bold').text('Education');
    (resumeContent.education || []).forEach((edu) => {
      doc.fontSize(10).font('Helvetica').text(`${edu.degree || ''} — ${edu.institution || ''} (${edu.graduationYear || ''})`);
    });
    doc.moveDown(1);

    doc.fontSize(13).font('Helvetica-Bold').text('Skills');
    doc.fontSize(10).font('Helvetica').text((resumeContent.skills || []).join(', '));
  });
}
