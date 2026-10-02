export interface Todo {
  id: string;
  /** e.g. "영어", "수학", or null when not specified */
  subject: string | null;
  content: string;
  /** ISO date string (YYYY-MM-DD) */
  startDate: string;
  /** ISO date string (YYYY-MM-DD), or null for a one-off todo */
  endDate: string | null;
  createdAt: number;
  updatedAt: number;
}

export type TodoInput = {
  subject: string | null;
  content: string;
  startDate: string;
  endDate: string | null;
};

export interface DateGroup {
  date: string;
  todos: Todo[];
}

export interface SubjectGroup {
  subject: string;
  todos: Todo[];
}
