import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates a human-friendly experience label from a start date.
 *
 * Increments every 6 months:
 *   < 6 months  → "< 1"
 *   6–11 months → "0.5+"
 *   12–17 months → "1+"
 *   18–23 months → "1.5+"
 *   24–29 months → "2+"
 *   … and so on in 0.5-year steps.
 *
 * @param startDate  ISO month string – "YYYY-MM"
 * @param now        Optional override for current date (useful in tests)
 */
export function getExperienceLabel(startDate: string, now: Date = new Date()): string {
  const [year, month] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, 1);

  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

  if (totalMonths < 6) return "< 1";

  // Round down to nearest 6-month step
  const halfYears = Math.floor(totalMonths / 6);
  const value = halfYears * 0.5;

  return `${value}+`;
}
