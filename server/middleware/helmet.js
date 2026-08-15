import helmet from 'helmet';

// Factory: Helmet security-header middleware (DENY framing per the production spec).
export function createHelmet() {
  return helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    xFrameOptions: { action: 'deny' },
    strictTransportSecurity: { maxAge: 15552000, includeSubDomains: true },
  });
}
