function pathnameOf(raw) {
  const url = raw || '/';
  const q = url.indexOf('?');
  return q === -1 ? url : url.slice(0, q);
}

function searchWithoutPath(rawUrl) {
  const url = new URL(rawUrl || '/', 'http://n');
  url.searchParams.delete('path');
  const qs = url.searchParams.toString();
  return qs ? `?${qs}` : '';
}

function pathFromQuery(pathQuery) {
  if (!pathQuery) return '';
  const segments = Array.isArray(pathQuery) ? pathQuery : [pathQuery];
  return segments.filter(Boolean).join('/');
}

function pathFromRequest(req) {
  if (req.query?.path) return pathFromQuery(req.query.path);
  const all = new URL(req.url || '/', 'http://n').searchParams.getAll('path');
  return pathFromQuery(all.length > 1 ? all : all[0]);
}

/** Chain of Responsibility: each strategy returns true when req.url is final. */
const restoreStrategies = [
  (req) => pathnameOf(req.url).startsWith('/api/'),
  (req) => {
    const uri = req.headers?.['x-forwarded-uri'];
    if (typeof uri !== 'string' || !uri.startsWith('/api/')) return false;
    req.url = uri;
    return true;
  },
  (req) => {
    const fromQuery = pathFromRequest(req);
    if (!fromQuery) return false;
    req.url = `/api/${fromQuery}${searchWithoutPath(req.url)}`;
    return true;
  },
  (req) => {
    const pathname = pathnameOf(req.url);
    const search = (req.url || '').includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    if (pathname !== '/' && pathname !== '/api') {
      req.url = `/api${pathname}${search}`;
      return true;
    }
    req.url = `/api${searchWithoutPath(req.url)}`;
    return true;
  },
];

export function restoreExpressUrl(req) {
  for (const step of restoreStrategies) {
    if (step(req)) return req;
  }
  return req;
}
