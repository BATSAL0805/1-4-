import type { DateGroup, Todo } from "../types";
import { compareDates, getDisplayDates } from "./date";

/** Groups todos by every date they should be displayed on, sorted ascending. */
export function groupTodosByDate(todos: Todo[]): DateGroup[] {
  const byDate = new Map<string, Todo[]>();

  for (const todo of todos) {
    for (const date of getDisplayDates(todo.startDate, todo.endDate)) {
      const existing = byDate.get(date);
      if (existing) {
        existing.push(todo);
      } else {
        byDate.set(date, [todo]);
      }
    }
  }

  return Array.from(byDate.entries())
    .sort((a, b) => compareDates(a[0], b[0]))
    .map(([date, dateTodos]) => ({ date, todos: dateTodos }));
}
