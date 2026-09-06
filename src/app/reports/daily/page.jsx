"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  IndianRupee,
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

export default function DailyReportPage() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      const response = await api.get(
        `/reports/daily?date=${encodeURIComponent(date)}`
      );

      setData(response?.data || {});
    } catch (error) {
      setData(null);

      showToast(
        error?.message || "Failed to load daily report.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [date]);

  const transactions = useMemo(() => {
    if (Array.isArray(data)) return data;

    return (
      data?.transactions ||
      data?.items ||
      data?.entries ||
      []
    );
  }, [data]);

  const income =
    Number(
      data?.income ??
        data?.totalIncome ??
        transactions
          .filter(
            (item) =>
              String(item.type).toUpperCase() === "INCOME"
          )
          .reduce(
            (sum, item) =>
              sum + Number(item.amount || 0),
            0
          )
    ) || 0;

  const expense =
    Number(
      data?.expense ??
        data?.totalExpense ??
        transactions
          .filter(
            (item) =>
              String(item.type).toUpperCase() === "EXPENSE"
          )
          .reduce(
            (sum, item) =>
              sum + Number(item.amount || 0),
            0
          )
    ) || 0;

  const balance =
    Number(
      data?.balance ??
        data?.closingBalance ??
        income - expense
    ) || 0;

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
        <Link href="/reports" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950">
          ← Back to Reports
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Reports
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Daily Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Daily income, expenses and financial transactions.
            </p>
          </div>

          <button
            onClick={loadReport}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-sm">
            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Income</p>
              <ArrowUpCircle
                size={20}
                className="text-emerald-600"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-emerald-600">
              {formatCurrency(income)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Expenses</p>
              <ArrowDownCircle
                size={20}
                className="text-red-600"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-red-600">
              {formatCurrency(expense)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Net Balance</p>
              <IndianRupee
                size={20}
                className="text-indigo-600"
              />
            </div>

            <p
              className={`mt-3 text-2xl font-bold ${
                balance >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Daily Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {formatDate(date)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Particular</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 5 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-4 font-semibold text-slate-700">
                        No transactions found
                      </p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((item, index) => {
                    const isIncome =
                      String(item.type || "").toUpperCase() ===
                      "INCOME";

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-slate-50"
                      >
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

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {item.category?.name ||
                            item.category ||
                            "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                              isIncome
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {isIncome
                              ? "Income"
                              : "Expense"}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-4 text-right font-bold ${
                            isIncome
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(item.amount)}
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