import { addDays, parseISODate, toISODate, todayString } from "./date";

export interface CalendarDay {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/** Builds a 6-week grid (Sun-Sat) covering `month` (0-11) of `year`, padded with adjacent-month days. */
export function getMonthGrid(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
  const today = todayString();

  const weeks: CalendarDay[][] = [];
  let cursor = toISODate(gridStart);

  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const parsed = parseISODate(cursor);
      days.push({
        date: cursor,
        day: parsed.getDate(),
        isCurrentMonth: parsed.getMonth() === month,
        isToday: cursor === today,
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(days);
  }

  return weeks;
}
