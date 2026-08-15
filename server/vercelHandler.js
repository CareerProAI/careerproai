import { restoreExpressUrl } from './restoreExpressUrl.js';

export const config = { maxDuration: 60 };

let appPromise;

async function loadApp() {
  if (!appPromise) {
    appPromise = import('./createApp.js').then(async ({ createApp, ready }) => {
      const app = createApp();
      await ready();
      return app;
    });
  }
  return appPromise;
}

function sendStartError(res, err) {
  console.error('API failed to start', err);
  if (res.headersSent) return;
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Failed to start API' }));
}

export default async function handler(req, res) {
  try {
    const app = await loadApp();
    restoreExpressUrl(req);
    return app(req, res);
  } catch (err) {
    sendStartError(res, err);
  }
}
