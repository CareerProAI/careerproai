import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Serve the Vite build from this process (Railway, Render, VPS). Vercel CDN does this instead. */
export function serveSpa(app) {
  if (process.env.VERCEL) return;
  const dist = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(dist)) return;
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}
