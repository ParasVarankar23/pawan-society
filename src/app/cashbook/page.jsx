"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
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

export default function CashBookPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const itemsPerPage = 15;

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      type,
      message,
    });
  };

  async function loadCashBook() {
    try {
      setRefreshing(true);

      const params = new URLSearchParams();

      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const query = params.toString();

      const response = await api.get(
        `/cashbook${query ? `?${query}` : ""}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
          response?.data?.transactions ||
          response?.data?.cashbook ||
          [];

      setTransactions(data);
    } catch (error) {
      console.error(error);
      setTransactions([]);

      showToast(
        error?.message || "Failed to load cash book.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCashBook();
  }, [fromDate, toDate]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return transactions;

    return transactions.filter((item) =>
      [
        item.description,
        item.particular,
        item.category,
        item.referenceNumber,
        item.reference,
        item.paymentMode,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [transactions, search]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((item) => {
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
  }, [filteredTransactions]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / itemsPerPage)
  );

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, fromDate, toDate]);

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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <BookOpen size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Finance
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Cash Book
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Daily record of society income and expenses
              </p>
            </div>
          </div>

          <button
            onClick={loadCashBook}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Income</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Expense</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Closing Balance</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                summary.balance >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search particular, category, reference..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
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
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Cash Book Register
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredTransactions.length} transactions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Sr. No.</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Particular</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4 text-right">Income</th>
                  <th className="px-5 py-4 text-right">Expense</th>
                  <th className="px-5 py-4 text-right">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 7 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 7 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
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
                  paginatedTransactions.map((item, index) => {
                    const isIncome =
                      String(item.type || "").toUpperCase() === "INCOME";

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {(page - 1) * itemsPerPage + index + 1}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(item.transactionDate || item.date)}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {item.description ||
                              item.particular ||
                              "-"}
                          </p>

                          {item.category && (
                            <p className="mt-1 text-xs text-slate-400">
                              {item.category?.name || item.category}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                              isIncome
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {isIncome ? "Income" : "Expense"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                          {isIncome
                            ? formatCurrency(item.amount)
                            : "-"}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-red-600">
                          {!isIncome
                            ? formatCurrency(item.amount)
                            : "-"}
                        </td>

                        <td className="px-5 py-4 text-right font-bold text-slate-800">
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

        {!loading && filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}