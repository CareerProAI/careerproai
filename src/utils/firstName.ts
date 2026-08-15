const HONORIFIC = /^(md|mr|mrs|ms|dr|prof)\.?$/i;

/** First usable given name — skips honorifics like "Md." */
export function firstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.find((part) => !HONORIFIC.test(part)) || parts[0] || 'there';
}
