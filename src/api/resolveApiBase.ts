/** Same-origin `/api` on every host. Override only for a split frontend/API deploy. */
export function resolveApiBase(viteApiBase?: string): string {
  const fromEnv = viteApiBase?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return '/api';
}
