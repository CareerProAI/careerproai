import { rateLimit } from 'express-rate-limit';

const shared = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Strategy pattern: bypass rate limiting for private/loopback addresses so
// local dev + Playwright testing can never exhaust the global window.
const PRIVATE_IP_RE = /^(127\.|::1$|::ffff:127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;
function skipPrivateIps(req) {
  const ip = req.ip || '';
  return process.env.NODE_ENV !== 'production' || PRIVATE_IP_RE.test(ip);
}

// Global: 200 requests / 15 minutes per IP (skipped for private IPs in dev).
export const globalLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 200,
  skip: skipPrivateIps,
  message: { error: 'Too many requests — please try again later.' },
});

// Decorator applied only to expensive AI routes: 10 requests / minute per IP.
export const aiLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 1000,
  limit: 10,
  message: { error: 'AI rate limit reached — please wait before making another AI request.' },
});
