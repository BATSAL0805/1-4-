import { useMemo, useState } from "react";
import type { DateGroup, Todo } from "../types";
import { getMonthGrid } from "../utils/calendar";
import { DAY_NAMES, todayString } from "../utils/date";
import { DateBlock } from "./DateBlock";

interface CalendarViewProps {
  groups: DateGroup[];
  onCopy: (group: DateGroup) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function CalendarView({ groups, onCopy, onEdit, onDelete }: CalendarViewProps) {
  const today = useMemo(() => todayString(), []);
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const groupsByDate = useMemo(() => {
    const map = new Map<string, DateGroup>();
    for (const group of groups) map.set(group.date, group);
    return map;
  }, [groups]);

  const weeks = useMemo(() => getMonthGrid(year, month), [year, month]);
  const selectedGroup = selectedDate ? groupsByDate.get(selectedDate) : undefined;

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function goToToday() {
    setYear(Number(today.slice(0, 4)));
    setMonth(Number(today.slice(5, 7)) - 1);
    setSelectedDate(today);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="이전 달"
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ‹
            </button>
            <h2 className="min-w-28 text-center text-base font-semibold text-gray-900 dark:text-gray-100">
              {year}년 {month + 1}월
            </h2>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="다음 달"
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ›
            </button>
          </div>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            오늘
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
          {DAY_NAMES.map((name) => (
            <div key={name} className="py-1">
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((cell) => {
            const cellGroup = groupsByDate.get(cell.date);
            const isSelected = cell.date === selectedDate;
            return (
              <button
                type="button"
                key={cell.date}
                onClick={() => setSelectedDate(cell.date)}
                className={`flex aspect-square flex-col items-center justify-start gap-0.5 rounded-md border p-1 text-xs transition-colors ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${cell.isCurrentMonth ? "" : "opacity-40"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    cell.isToday
                      ? "bg-indigo-600 font-semibold text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cell.day}
                </span>
                {cellGroup && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {selectedDate &&
        (selectedGroup ? (
          <DateBlock group={selectedGroup} onCopy={onCopy} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            이 날짜에 할일이 없습니다.
          </p>
        ))}
    </div>
  );
}
