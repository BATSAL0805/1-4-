import { useRef, useState } from "react";
import type { DateGroup, SubjectGroup, Todo } from "../types";
import { addDays, formatDayPageHeader, formatShortDate, todayString } from "../utils/date";
import { groupTodosBySubject } from "../utils/grouping";

interface DayListViewProps {
  groups: DateGroup[];
  onCopyDay: (group: DateGroup) => void;
  onCopySubject: (subjectGroup: SubjectGroup) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const SWIPE_THRESHOLD_PX = 50;

export function DayListView({ groups, onCopyDay, onCopySubject, onEdit, onDelete }: DayListViewProps) {
  const [selectedDate, setSelectedDate] = useState(() => todayString());
  const dateInputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const group = groups.find((g) => g.date === selectedDate);
  const subjectGroups = group ? groupTodosBySubject(group.todos) : [];

  function goToDay(date: string) {
    setSelectedDate(date);
  }

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.click();
    }
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return;
    goToDay(addDays(selectedDate, deltaX < 0 ? 1 : -1));
  }

  return (
    <div className="space-y-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => goToDay(addDays(selectedDate, -1))}
          aria-label="이전 날"
          className="rounded-md px-2 py-1 text-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ‹
        </button>

        <div className="relative flex-1 text-center">
          <button
            type="button"
            onClick={openDatePicker}
            className="rounded-md px-2 py-1 text-base font-bold tabular-nums tracking-wide text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {formatDayPageHeader(selectedDate)}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(event) => event.target.value && goToDay(event.target.value)}
            className="sr-only"
            tabIndex={-1}
          />
        </div>

        <button
          type="button"
          onClick={() => goToDay(addDays(selectedDate, 1))}
          aria-label="다음 날"
          className="rounded-md px-2 py-1 text-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => group && onCopyDay(group)}
          disabled={!group}
          className="ml-1 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          복사
        </button>
      </div>

      {subjectGroups.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          등록된 알림이 없어요
        </p>
      )}

      {subjectGroups.map((subjectGroup) => (
        <section
          key={subjectGroup.subject}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {subjectGroup.subject}
            </h3>
            <button
              type="button"
              onClick={() => onCopySubject(subjectGroup)}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              복사
            </button>
          </div>
          <ol className="space-y-2">
            {subjectGroup.todos.map((todo, index) => (
              <li
                key={todo.id}
                className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-none last:pb-0 dark:border-gray-800"
              >
                <p className="min-w-0 flex-1 break-words text-sm text-gray-800 dark:text-gray-200">
                  <span className="mr-1 text-gray-400 dark:text-gray-500">{index + 1}.</span>
                  {todo.content}
                  {todo.endDate && (
                    <span className="ml-1.5 inline-block rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      [{formatShortDate(todo.endDate)}까지]
                    </span>
                  )}
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
      ))}
    </div>
  );
}
