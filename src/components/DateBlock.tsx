import type { DateGroup, Todo } from "../types";
import { formatDateWithDay } from "../utils/date";

interface DateBlockProps {
  group: DateGroup;
  onCopy: (group: DateGroup) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function DateBlock({ group, onCopy, onEdit, onDelete }: DateBlockProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          &lt;{formatDateWithDay(group.date)}&gt;
        </h2>
        <button
          type="button"
          onClick={() => onCopy(group)}
          className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          복사
        </button>
      </div>
      <ol className="space-y-2">
        {group.todos.map((todo, index) => (
          <li
            key={todo.id}
            className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-none last:pb-0 dark:border-gray-800"
          >
            <p className="min-w-0 flex-1 break-words text-sm text-gray-800 dark:text-gray-200">
              <span className="mr-1 text-gray-400 dark:text-gray-500">{index + 1}.</span>
              {todo.content}
            </p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEdit(todo)}
                className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete(todo)}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
