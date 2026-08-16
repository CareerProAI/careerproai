/** Split a list into fixed-size windows (Iterator helper for batch Facades). */
export function chunkArray<T>(items: T[], size: number): T[][] {
  const windowSize = Math.max(1, size);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += windowSize) {
    chunks.push(items.slice(i, i + windowSize));
  }
  return chunks;
}
