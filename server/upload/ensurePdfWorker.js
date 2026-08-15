/** Facade: pdf-parse's Node/Vercel entry must load the worker before PDFParse. */
let workerReady;

export function ensurePdfWorker() {
  if (!workerReady) workerReady = import('pdf-parse/worker');
  return workerReady;
}
