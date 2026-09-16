const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Returns today as a YYYY-MM-DD string in the local timezone. */
export function todayString(): string {
  return toISODate(new Date());
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a YYYY-MM-DD string into a local-midnight Date. */
export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Formats YYYY-MM-DD as "9/15(화)". */
export function formatDateWithDay(value: string): string {
  const date = parseISODate(value);
  return `${date.getMonth() + 1}/${date.getDate()}(${DAY_NAMES[date.getDay()]})`;
}

export function addDays(value: string, amount: number): string {
  const date = parseISODate(value);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function compareDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Returns every date string a todo should appear on.
 * No endDate -> only startDate. With endDate -> [startDate, endDate).
 */
export function getDisplayDates(startDate: string, endDate: string | null): string[] {
  if (!endDate) return [startDate];

  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  const dayCount = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);

  const dates: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
}
