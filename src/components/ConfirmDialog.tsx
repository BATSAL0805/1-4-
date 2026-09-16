interface ConfirmDialogProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ message, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xs rounded-xl bg-white p-5 text-center shadow-xl dark:bg-gray-900">
        <p className="mb-4 text-sm text-gray-800 dark:text-gray-200">{message}</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
