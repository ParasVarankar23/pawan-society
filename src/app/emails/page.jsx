"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EmailsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (message, type = "success") =>
    setToast({
      show: true,
      type,
      message,
    });

  async function loadEmails() {
    try {
      setRefreshing(true);

      const query =
        type !== "ALL"
          ? `?type=${encodeURIComponent(type)}`
          : "";

      const response = await api.get(`/email${query}`);

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
          response?.data?.logs ||
          [];

      setLogs(data);
    } catch (error) {
      setLogs([]);

      showToast(
        error?.message ||
          "Failed to load email logs. Check the email logs API.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEmails();
  }, [type]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return logs;

    return logs.filter((item) =>
      [
        item.recipient,
        item.subject,
        item.type,
        item.reference,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [logs, search]);

  const sentCount = filteredLogs.filter(
    (item) => item.status === "SENT"
  ).length;

  const failedCount = filteredLogs.filter(
    (item) => item.status === "FAILED"
  ).length;

  return (
    <AppShell>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            show: false,
          }))
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Mail size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Communication
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Emails
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor bills, receipts, reminders and email delivery
              </p>
            </div>
          </div>

          <button
            onClick={loadEmails}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Emails</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredLogs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Sent</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {sentCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Failed</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {failedCount}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipient, subject, reference..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="BILL">Bill</option>
              <option value="RECEIPT">Receipt</option>
              <option value="REMINDER">Reminder</option>
              <option value="OTP">OTP</option>
              <option value="REPORT">Report</option>
              <option value="TEST">Test</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Recipient</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 6 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Mail
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No email logs found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(item.sentAt || item.createdAt)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.recipient || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.type || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.subject || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {item.reference || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {item.status === "SENT" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 size={13} />
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                            <XCircle size={13} />
                            {item.status || "Failed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}