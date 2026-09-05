"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

/* =========================================================
   ICONS
========================================================= */

function ReceiptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-3" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 3" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function money(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function paymentModeLabel(mode) {
  if (!mode) return "-";

  return mode
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function emailStatusClass(status) {
  switch (status) {
    case "SENT":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "FAILED":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  type = "default",
}) {
  const styles = {
    default:
      "bg-slate-100 text-slate-700",
    emerald:
      "bg-emerald-50 text-emerald-600",
    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[type]}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MOBILE RECEIPT CARD
========================================================= */

function ReceiptCard({ receipt }) {
  const room =
    receipt.roomId?.roomNumber || "-";

  const member =
    receipt.memberId?.name || "-";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-sm font-bold text-slate-950">
            Receipt #{receipt.receiptNumber}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {member} · Room {room}
          </p>

        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${emailStatusClass(
            receipt.emailStatus
          )}`}
        >
          {receipt.emailStatus ||
            "NOT_SENT"}
        </span>

      </div>

      <div className="mt-4 rounded-xl bg-slate-950 p-4">

        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          Receipt Amount
        </p>

        <p className="mt-1 text-xl font-bold text-white">
          {money(receipt.amount)}
        </p>

      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] text-slate-400">
            Date
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {formatDate(
              receipt.receiptDate
            )}
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] text-slate-400">
            Mode
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {paymentModeLabel(
              receipt.paymentMode
            )}
          </p>

        </div>

      </div>

      <div className="mt-4 flex gap-2">

        <Link
          href={`/receipts/${receipt._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <EyeIcon />
          View
        </Link>

        <a
          href={`/api/receipts/${receipt._id}/pdf`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <DownloadIcon />
          PDF
        </a>

      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ReceiptsPage() {
  const [receipts, setReceipts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadReceipts() {
    setLoading(true);
    setError("");

    try {
      const result =
        await api.get("/receipts");

      const list =
        Array.isArray(result.data)
          ? result.data
          : result.data?.receipts || [];

      setReceipts(list);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load receipts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReceipts();
  }, []);

  const filteredReceipts =
    useMemo(() => {
      if (!search.trim()) {
        return receipts;
      }

      const query =
        search.toLowerCase();

      return receipts.filter(
        (receipt) => {
          const receiptNumber =
            String(
              receipt.receiptNumber ||
                ""
            );

          const name =
            receipt.memberId?.name ||
            "";

          const room =
            receipt.roomId?.roomNumber ||
            "";

          return (
            receiptNumber
              .toLowerCase()
              .includes(query) ||
            name
              .toLowerCase()
              .includes(query) ||
            room
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [receipts, search]);

  const summary = useMemo(() => {
    const amount =
      receipts.reduce(
        (sum, receipt) =>
          sum +
          Number(receipt.amount || 0),
        0
      );

    const sent =
      receipts.filter(
        (receipt) =>
          receipt.emailStatus ===
          "SENT"
      ).length;

    return {
      count: receipts.length,
      amount,
      sent,
      pending:
        receipts.length - sent,
    };
  }, [receipts]);

  return (
    <AppShell>

      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Finance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Receipts
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View, download and manage member payment
              receipts.
            </p>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          <StatCard
            title="Receipts"
            value={summary.count}
            subtitle="Generated receipts"
            icon={<ReceiptIcon />}
          />

          <StatCard
            title="Total Amount"
            value={money(summary.amount)}
            subtitle="Receipt value"
            type="emerald"
            icon={<CheckIcon />}
          />

          <StatCard
            title="Emails Sent"
            value={summary.sent}
            subtitle="Receipts emailed"
            type="blue"
            icon={<MailIcon />}
          />

          <StatCard
            title="Pending Email"
            value={summary.pending}
            subtitle="Not sent / failed"
            icon={<MailIcon />}
          />

        </div>

        {/* SEARCH */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search receipt number, member or room..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />

            </div>

            <button
              type="button"
              onClick={loadReceipts}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              Refresh
            </button>

          </div>

        </div>

        {/* RECEIPT REGISTER */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Receipt Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredReceipts.length} receipt
                {filteredReceipts.length === 1
                  ? ""
                  : "s"} displayed
              </p>

            </div>

            <button
              onClick={loadReceipts}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:flex"
            >
              <RefreshIcon />
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="space-y-3 p-5">

              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}

            </div>
          ) : filteredReceipts.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ReceiptIcon />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No receipts found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Receipts will appear here automatically
                after successful payments are recorded.
              </p>

            </div>
          ) : (
            <>
              {/* MOBILE */}

              <div className="space-y-3 bg-slate-50 p-4 lg:hidden">

                {filteredReceipts.map(
                  (receipt) => (
                    <ReceiptCard
                      key={
                        receipt._id
                      }
                      receipt={
                        receipt
                      }
                    />
                  )
                )}

              </div>

              {/* DESKTOP */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1100px] text-sm">

                  <thead className="bg-slate-50/70">

                    <tr className="border-b border-slate-100">

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Receipt
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Member
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Room
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Mode
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Amount
                      </th>

                      <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredReceipts.map(
                      (receipt) => (
                        <tr
                          key={
                            receipt._id
                          }
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                        >

                          <td className="px-5 py-4">

                            <p className="font-bold text-slate-900">
                              #
                              {
                                receipt.receiptNumber
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-700">
                            {receipt
                              .memberId
                              ?.name ||
                              "-"}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {receipt.roomId
                              ?.roomNumber ||
                              "-"}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatDate(
                              receipt.receiptDate
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {paymentModeLabel(
                              receipt.paymentMode
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-slate-950">
                            {money(
                              receipt.amount
                            )}
                          </td>

                          <td className="px-5 py-4 text-center">

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${emailStatusClass(
                                receipt.emailStatus
                              )}`}
                            >
                              {receipt.emailStatus ||
                                "NOT_SENT"}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-right">

                            <div className="flex justify-end gap-2">

                              <Link
                                href={`/receipts/${receipt._id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-950"
                              >
                                <EyeIcon />
                                View
                              </Link>

                              <a
                                href={`/api/receipts/${receipt._id}/pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                              >
                                <DownloadIcon />
                                PDF
                              </a>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            </>
          )}

        </div>
      </div>
    </AppShell>
  );
}