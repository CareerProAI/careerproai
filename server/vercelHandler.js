import { createApp, ready } from './createApp.js';
import { restoreExpressUrl } from './restoreExpressUrl.js';

const app = createApp();

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  await ready();
  restoreExpressUrl(req);
  return app(req, res);
}
