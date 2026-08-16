/** Intl.RelativeTimeFormat — Baseline API for "3 minutes ago" / "yesterday". */
function formatWithIntl(deltaSec: number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const abs = Math.abs(deltaSec);
  if (abs < 60) return 'Just now';
  if (abs < 3600) return rtf.format(Math.round(deltaSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(deltaSec / 3600), 'hour');
  return rtf.format(Math.round(deltaSec / 86400), 'day');
}

export function formatRelativeFromMs(thenMs: number, nowMs = Date.now()): string {
  if (!Number.isFinite(thenMs) || thenMs <= 0) return 'Recently';
  return formatWithIntl(Math.round((thenMs - nowMs) / 1000));
}

/** Resume ids are `res-<unix-ms>` — that timestamp is the analysis time. */
export function formatProfileUpdated(profileId: string): string {
  const ms = Number(String(profileId).replace(/^res-/, ''));
  return formatRelativeFromMs(ms);
}
