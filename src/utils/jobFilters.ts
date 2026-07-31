// Parses the lead figure out of a salary range string (e.g. "$150k - $180k" -> 150000)
export function parseSalaryMin(salary: string): number {
  const match = salary.match(/\d+/);
  return match ? parseInt(match[0], 10) * 1000 : 0;
}
