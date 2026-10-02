import type { DateGroup, SubjectGroup, Todo } from "../types";
import { compareDates, getDisplayDates } from "./date";

const OTHER_SUBJECT = "기타";

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

/**
 * Groups todos by subject, in order of first appearance.
 * Todos with no subject are bucketed under "기타", always placed last.
 */
export function groupTodosBySubject(todos: Todo[]): SubjectGroup[] {
  const order: string[] = [];
  const bySubject = new Map<string, Todo[]>();

  for (const todo of todos) {
    const key = todo.subject?.trim() || OTHER_SUBJECT;
    const existing = bySubject.get(key);
    if (existing) {
      existing.push(todo);
    } else {
      bySubject.set(key, [todo]);
      order.push(key);
    }
  }

  const orderedKeys = order.filter((key) => key !== OTHER_SUBJECT);
  if (order.includes(OTHER_SUBJECT)) orderedKeys.push(OTHER_SUBJECT);

  return orderedKeys.map((subject) => ({ subject, todos: bySubject.get(subject)! }));
}
