import { rateLimit } from 'express-rate-limit';

const shared = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Global: 500 requests / 15 minutes per IP.
// Raised from 200 → 500 because the bootstrap path makes ~10 non-AI requests
// per page load (resumes/all, config-status, saved-jobs, etc.), and devtools
// reloads + retries consumed the old budget very quickly.
export const globalLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: { error: 'Too many requests — please try again later.' },
});

// Decorator applied only to expensive AI routes: 10 requests / minute per IP.
export const aiLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 1000,
  limit: 10,
  message: { error: 'AI rate limit reached — please wait before making another AI request.' },
});
