export type ViewMode = "list" | "calendar";

interface HeaderProps {
  onAdd: () => void;
  onCopyAll: () => void;
  hasTodos: boolean;
  isDark: boolean;
  onToggleDark: () => void;
  view: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export function Header({
  onAdd,
  onCopyAll,
  hasTodos,
  isDark,
  onToggleDark,
  view,
  onChangeView,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">1-4 알림장</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700">
            <button
              type="button"
              onClick={() => onChangeView("list")}
              aria-pressed={view === "list"}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                view === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              목록
            </button>
            <button
              type="button"
              onClick={() => onChangeView("calendar")}
              aria-pressed={view === "calendar"}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                view === "calendar"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              캘린더
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 active:bg-indigo-700"
          >
            할일 추가
          </button>
          <button
            type="button"
            onClick={onCopyAll}
            disabled={!hasTodos}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            전체 복사
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label="다크모드 전환"
            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}
