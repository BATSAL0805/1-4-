export interface Todo {
  id: string;
  content: string;
  /** ISO date string (YYYY-MM-DD) */
  startDate: string;
  /** ISO date string (YYYY-MM-DD), or null for a one-off todo */
  endDate: string | null;
  createdAt: number;
  updatedAt: number;
}

export type TodoInput = {
  content: string;
  startDate: string;
  endDate: string | null;
};

export interface DateGroup {
  date: string;
  todos: Todo[];
}
