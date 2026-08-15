// Strategy: exact allowlist, plus loopback http(s) so Vite fallback ports (3002+) work.
export function parseAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || process.env.APP_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
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

export function isOriginAllowed(origin, allowed) {
  return allowed.has(origin) || isLoopbackOrigin(origin);
}

export function createCorsAllowlist(origins = parseAllowedOrigins()) {
  const allowed = new Set(origins);
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin, allowed)) {
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
