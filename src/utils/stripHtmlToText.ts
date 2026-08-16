const MAX_DESCRIPTION_LENGTH = 4000;

/** Converts untrusted HTML to plain text — never rendered via dangerouslySetInnerHTML. */
export function stripHtmlToText(html: string): string {
  return html
    .replace(/<\/(p|li|div|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/<[^>]*$/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_DESCRIPTION_LENGTH);
}
