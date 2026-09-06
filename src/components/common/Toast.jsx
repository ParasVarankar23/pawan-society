"use client";

export default function Toast({
  show = true,
  type = "error",
  message,
  onClose,
}) {
  if (!show || !message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg ${
        isSuccess
          ? "border-emerald-200 text-emerald-700"
          : "border-red-200 text-red-700"
      }`}
    >
      <span className="flex-1">{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className={`text-lg leading-none ${
          isSuccess
            ? "text-emerald-400 hover:text-emerald-700"
            : "text-red-400 hover:text-red-700"
        }`}
      >
        ×
      </button>
    </div>
  );
}