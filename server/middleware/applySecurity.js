import { createHelmet } from './helmet.js';
import { createCorsAllowlist } from './cors.js';
import { globalLimiter, aiLimiter } from './rateLimit.js';
import { jsonBodyLimit } from './jsonBodyLimit.js';

export { aiLimiter };

// Facade + Chain of Responsibility: Helmet → CORS → global limit → JSON cap.
export function applySecurity(app) {
  app.use(createHelmet());
  app.use(createCorsAllowlist());
  app.use(globalLimiter);
  app.use(jsonBodyLimit);
}
