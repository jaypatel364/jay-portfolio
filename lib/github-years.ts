export function contributionYearQuery(now = new Date()): string {
  const year = now.getFullYear();
  return `y=${year - 1}&y=${year}`;
}
