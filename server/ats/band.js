export function bandFromScore(score) {
  const n = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  if (n >= 85) return 'High ATS Compatibility';
  if (n >= 70) return 'Good ATS Compatibility';
  return 'Low ATS Compatibility';
}
