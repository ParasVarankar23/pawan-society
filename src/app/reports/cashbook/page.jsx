"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  RefreshCw,
  WalletCards,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function CashBookReportPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  async function loadReport() {
    try {
      setRefreshing(true);

      const params = new URLSearchParams();

      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const query = params.toString();

      const response = await api.get(
        `/reports/cashbook${query ? `?${query}` : ""}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
          response?.data?.transactions ||
          response?.data?.cashbook ||
          [];

      setItems(data);
    } catch (error) {
      setItems([]);

      showToast(
        error?.message || "Failed to load cash book report.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [fromDate, toDate]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    items.forEach((item) => {
      const amount = Number(item.amount || 0);

      if (
        String(item.type || "").toUpperCase() === "INCOME"
      ) {
        income += amount;
      } else {
        expense += amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [items]);

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
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Reports
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Cash Book Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Complete income and expense cash book.
            </p>
          </div>

          <button
            onClick={loadReport}
            disabled={refreshing}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Income
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Expenses
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Net Balance
            </p>

            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Sr. No.</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Particular</th>
                  <th className="px-5 py-4">Income</th>
                  <th className="px-5 py-4">Expense</th>
                  <th className="px-5 py-4">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 7 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 6 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-4 font-semibold text-slate-700">
                        No cash book entries found
                      </p>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const isIncome =
                      String(item.type || "").toUpperCase() ===
                      "INCOME";

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            item.transactionDate ||
                              item.date
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.description ||
                            item.particular ||
                            "-"}
                        </td>

                        <td className="px-5 py-4 font-semibold text-emerald-600">
                          {isIncome
                            ? formatCurrency(item.amount)
                            : "-"}
                        </td>

                        <td className="px-5 py-4 font-semibold text-red-600">
                          {!isIncome
                            ? formatCurrency(item.amount)
                            : "-"}
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-800">
                          {formatCurrency(
                            item.balance ??
                              item.runningBalance ??
                              0
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}