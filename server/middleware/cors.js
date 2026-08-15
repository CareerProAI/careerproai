// Strategy: exact allowlist, plus loopback http(s) so Vite fallback ports (3002+) work.
function vercelDeployOrigins() {
  const urls = [];
  if (process.env.VERCEL_URL) urls.push(`https://${process.env.VERCEL_URL}`);
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) urls.push(prod.startsWith('http') ? prod : `https://${prod}`);
  return urls;
}

export function parseAllowedOrigins() {
  const listed = (process.env.ALLOWED_ORIGINS || process.env.APP_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return [...new Set([...listed, ...vercelDeployOrigins()])];
}

export function isLoopbackOrigin(origin) {
  try {
    const url = new URL(origin);
    const host = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return host && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return false;
  }
}

export function requestHostname(req) {
  const forwarded = req.headers?.['x-forwarded-host'];
  const raw = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || req.headers?.host || '';
  return String(raw).split(',')[0].trim().split(':')[0].toLowerCase();
}

export function isSameHostOrigin(origin, req) {
  try {
    const host = requestHostname(req);
    return Boolean(host) && new URL(origin).hostname.toLowerCase() === host;
  } catch {
    return false;
  }
}

export function isOriginAllowed(origin, allowed, req) {
  return allowed.has(origin) || isLoopbackOrigin(origin) || isSameHostOrigin(origin, req);
}

export function createCorsAllowlist(origins = parseAllowedOrigins()) {
  const allowed = new Set(origins);
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin, allowed, req)) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
      res.header('Access-Control-Allow-Origin', origins[0]);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Vary', 'Origin');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  };
}
