import { useMemo, useState } from "react";
import { CalendarView } from "./components/CalendarView";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DateBlock } from "./components/DateBlock";
import { Header, type ViewMode } from "./components/Header";
import { Toast } from "./components/Toast";
import { TodoFormModal } from "./components/TodoFormModal";
import { useDarkMode } from "./hooks/useDarkMode";
import { useTodos } from "./hooks/useTodos";
import type { DateGroup, Todo, TodoInput } from "./types";
import { copyToClipboard, formatAllGroups, formatDateGroup } from "./utils/clipboard";
import { groupTodosByDate } from "./utils/grouping";

export default function App() {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [view, setView] = useState<ViewMode>("list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const groups = useMemo(() => groupTodosByDate(todos), [todos]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  }

  function openAddForm() {
    setEditingTodo(null);
    setIsFormOpen(true);
  }

  function openEditForm(todo: Todo) {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: TodoInput) {
    if (editingTodo) {
      await updateTodo(editingTodo.id, input);
    } else {
      await addTodo(input);
    }
    setIsFormOpen(false);
    setEditingTodo(null);
  }

  async function handleConfirmDelete() {
    if (!deletingTodo) return;
    await deleteTodo(deletingTodo.id);
    setDeletingTodo(null);
  }

  async function handleCopyGroup(group: DateGroup) {
    const ok = await copyToClipboard(formatDateGroup(group));
    showToast(ok ? "복사되었습니다." : "복사에 실패했습니다.");
  }

  async function handleCopyAll() {
    if (groups.length === 0) return;
    const ok = await copyToClipboard(formatAllGroups(groups));
    showToast(ok ? "복사되었습니다." : "복사에 실패했습니다.");
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <Header
        onAdd={openAddForm}
        onCopyAll={handleCopyAll}
        hasTodos={groups.length > 0}
        isDark={isDark}
        onToggleDark={toggleDark}
        view={view}
        onChangeView={setView}
      />

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {loading && (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            불러오는 중...
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            데이터를 불러오지 못했습니다: {error}
          </p>
        )}

        {!loading && !error && view === "calendar" && (
          <CalendarView
            groups={groups}
            onCopy={handleCopyGroup}
            onEdit={openEditForm}
            onDelete={setDeletingTodo}
          />
        )}

        {!loading && !error && view === "list" && groups.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            등록된 할일이 없습니다. &quot;할일 추가&quot; 버튼을 눌러 시작해보세요.
          </p>
        )}

        {!loading &&
          !error &&
          view === "list" &&
          groups.map((group) => (
            <DateBlock
              key={group.date}
              group={group}
              onCopy={handleCopyGroup}
              onEdit={openEditForm}
              onDelete={setDeletingTodo}
            />
          ))}
      </main>

      {isFormOpen && (
        <TodoFormModal
          initial={editingTodo}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTodo(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {deletingTodo && (
        <ConfirmDialog
          message="이 할일을 삭제할까요?"
          onCancel={() => setDeletingTodo(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
