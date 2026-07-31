import PDFDocument from 'pdfkit';

// One Groq/Gemini call produces both the resume and cover letter as structured JSON;
// pdfkit then renders that structured content into PDF buffers, collected via
// on('data')/on('end') rather than piped to a file so they can be base64-encoded
// straight into the JSON response.
export function renderPdfBuffer(renderFn) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    renderFn(doc);
    doc.end();
  });
}
