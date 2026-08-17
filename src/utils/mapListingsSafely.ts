/** One corrupt listing must not blank the whole Job Match feed. */
export function mapListingsSafely<T, R>(listings: T[], mapOne: (item: T) => R): R[] {
  const mapped: R[] = [];
  for (const item of listings) {
    try {
      mapped.push(mapOne(item));
    } catch (err) {
      console.error('Skipping unreadable job listing:', err);
    }
  }
  return mapped;
}
