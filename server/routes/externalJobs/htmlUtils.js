const MAX_JOB_DESCRIPTION_LENGTH = 4000;

// Converts external description HTML (LinkedIn or bdjobs) to plain text (never sent to
// the client as raw HTML) — block-level tags become newlines first so structure survives
// roughly intact.
export function stripJobDescriptionHtml(html) {
  return html
    .replace(/<\/(p|li|div|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_JOB_DESCRIPTION_LENGTH);
}
