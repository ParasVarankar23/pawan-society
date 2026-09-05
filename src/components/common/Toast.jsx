"use client";

export default function Toast({
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg"
    >
      <span className="flex-1">{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-lg leading-none text-red-400 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
}