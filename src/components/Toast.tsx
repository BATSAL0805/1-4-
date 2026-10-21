interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 max-w-[90vw] -translate-x-1/2 break-words rounded-xl bg-gray-900 px-4 py-2 text-center text-sm text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
      {message}
    </div>
  );
}
