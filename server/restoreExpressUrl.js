function pathFromQuery(pathQuery) {
  if (!pathQuery) return '';
  const segments = Array.isArray(pathQuery) ? pathQuery : [pathQuery];
  return segments.filter(Boolean).join('/');
}

function searchWithoutPath(rawUrl) {
  const url = new URL(rawUrl, 'http://n');
  url.searchParams.delete('path');
  const qs = url.searchParams.toString();
  return qs ? `?${qs}` : '';
}

/** Map Vercel catch-all / rewrite URLs back to Express `/api/...` mounts. */
export function restoreExpressUrl(req) {
  const raw = req.url || '/';
  const qIndex = raw.indexOf('?');
  const pathname = qIndex === -1 ? raw : raw.slice(0, qIndex);
  const search = qIndex === -1 ? '' : raw.slice(qIndex);

  if (pathname === '/api' || pathname.startsWith('/api/')) return req;

  const headerPath = req.headers?.['x-invoke-path'] || req.headers?.['x-matched-path'];
  if (typeof headerPath === 'string' && headerPath.startsWith('/api')) {
    req.url = headerPath.split('?')[0] + search;
    return req;
  }

  const fromQuery = pathFromQuery(req.query?.path);
  if (fromQuery) {
    req.url = `/api/${fromQuery}${searchWithoutPath(raw)}`;
    return req;
  }

  if (pathname.startsWith('/') && pathname !== '/') {
    req.url = `/api${pathname}${search}`;
    return req;
  }

  req.url = `/api${search}`;
  return req;
}
