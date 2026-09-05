"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  WalletCards,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCategoryName = (expense) =>
  expense.category?.name ||
  expense.categoryName ||
  expense.category ||
  "Other";

const getExpenseAmount = (expense) =>
  Number(
    expense.amount ??
      expense.actualAmount ??
      0
  );

const getPaymentMode = (expense) =>
  expense.paymentMode ||
  "-";

const getVendorName = (expense) =>
  expense.vendorName ||
  expense.vendor ||
  "-";

const getBillNumber = (expense) =>
  expense.billNumber ||
  "-";

const getDescription = (expense) =>
  expense.description ||
  "-";

const getStatus = (expense) =>
  expense.status ||
  "ACTIVE";

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const normalizedStatus =
    String(status || "ACTIVE").toUpperCase();

  if (normalizedStatus === "CANCELLED") {
    return (
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
      Active
    </span>
  );
}

/* =========================================================
   PAYMENT MODE BADGE
========================================================= */

function PaymentModeBadge({ mode }) {
  if (!mode || mode === "-") {
    return (
      <span className="text-sm text-slate-400">
        -
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
      {String(mode).replaceAll("_", " ")}
    </span>
  );
}

/* =========================================================
   LOADING ROWS
========================================================= */

function LoadingRows() {
  return Array.from({ length: 7 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 9 }).map((__, cellIndex) => (
        <td
          key={cellIndex}
          className="px-5 py-5"
        >
          <div className="h-4 animate-pulse rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  ));
}

/* =========================================================
   LOADING MOBILE CARDS
========================================================= */

function LoadingCards() {
  return Array.from({ length: 5 }).map((_, index) => (
    <div
      key={index}
      className="h-56 animate-pulse rounded-2xl bg-white"
    />
  ));
}

/* =========================================================
   EMPTY DESKTOP
========================================================= */

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={9}
        className="px-5 py-16 text-center"
      >
        <WalletCards
          size={42}
          className="mx-auto text-slate-300"
        />

        <p className="mt-4 font-semibold text-slate-700">
          No expenses found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Try changing your filters or add a new expense.
        </p>
      </td>
    </tr>
  );
}

/* =========================================================
   EMPTY MOBILE
========================================================= */

function EmptyCard() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
      <WalletCards
        size={42}
        className="mx-auto text-slate-300"
      />

      <p className="mt-4 font-semibold text-slate-700">
        No expenses found
      </p>

      <p className="mt-1 text-sm text-slate-400">
        Try changing your filters or add a new expense.
      </p>

      <Link
        href="/expenses/add"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus size={16} />
        Add Expense
      </Link>
    </div>
  );
}

/* =========================================================
   MOBILE EXPENSE CARD
========================================================= */

function ExpenseCard({ expense }) {
  const amount =
    getExpenseAmount(expense);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* Header */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="text-xs text-slate-400">
            {formatDate(expense.date)}
          </p>

          <h3 className="mt-1 truncate text-base font-bold text-slate-900">
            {getCategoryName(
              expense
            )}
          </h3>

          <p className="mt-0.5 truncate text-sm text-slate-500">
            {getVendorName(
              expense
            )}
          </p>

        </div>

        <StatusBadge
          status={getStatus(
            expense
          )}
        />

      </div>

      {/* Description */}

      <div className="mt-4 rounded-xl bg-slate-50 p-3">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Particular
        </p>

        <p className="mt-1 text-sm text-slate-700">
          {getDescription(
            expense
          )}
        </p>

      </div>

      {/* Details */}

      <div className="mt-3 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Bill Number
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {getBillNumber(
              expense
            )}
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Payment
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {getPaymentMode(
              expense
            )}
          </p>

        </div>

      </div>

      {/* Amount */}

      <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 p-4">

        <div>

          <p className="text-xs font-medium text-red-500">
            Expense Amount
          </p>

          <p className="mt-1 text-xl font-bold text-red-700">
            {formatCurrency(
              amount
            )}
          </p>

        </div>

        {expense._id && (
          <Link
            href={`/expenses/${expense._id}`}
            title="View expense"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-100"
          >
            <Eye size={16} />
          </Link>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ExpensesPage() {
  const [expenses, setExpenses] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [toast, setToast] =
    useState({
      show: false,
      type: "success",
      message: "",
    });

  const itemsPerPage = 10;

  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(
    message,
    type = "success"
  ) {
    setToast({
      show: true,
      type,
      message,
    });
  }

  /* =======================================================
     LOAD EXPENSES
  ======================================================= */

  async function loadExpenses() {
    try {
      setRefreshing(true);

      const params =
        new URLSearchParams();

      if (category !== "ALL") {
        params.set(
          "category",
          category
        );
      }

      if (fromDate) {
        params.set(
          "fromDate",
          fromDate
        );
      }

      if (toDate) {
        params.set(
          "toDate",
          toDate
        );
      }

      const query =
        params.toString();

      const response =
        await api.get(
          `/expenses${
            query
              ? `?${query}`
              : ""
          }`
        );

      const data =
        Array.isArray(
          response?.data
        )
          ? response.data
          : response?.data?.items ||
            response?.data?.expenses ||
            [];

      setExpenses(data);
    } catch (error) {
      console.error(
        "Failed to load expenses:",
        error
      );

      setExpenses([]);

      showToast(
        error?.message ||
          "Failed to load expenses.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  async function loadCategories() {
    try {
      const response =
        await api.get(
          "/expenses/categories"
        );

      const data =
        Array.isArray(
          response?.data
        )
          ? response.data
          : response?.data?.items ||
            response?.data?.categories ||
            [];

      setCategories(data);
    } catch (error) {
      console.error(
        "Failed to load expense categories:",
        error
      );

      setCategories([]);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, [
    category,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    loadCategories();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredExpenses =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return expenses;
      }

      return expenses.filter(
        (expense) => {
          const values = [
            getCategoryName(
              expense
            ),
            getVendorName(
              expense
            ),
            getBillNumber(
              expense
            ),
            getDescription(
              expense
            ),
            getPaymentMode(
              expense
            ),
          ];

          return values
            .join(" ")
            .toLowerCase()
            .includes(query);
        }
      );
    }, [expenses, search]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      let totalExpense = 0;
      let activeExpense = 0;
      let cancelledExpense = 0;

      filteredExpenses.forEach(
        (expense) => {
          const amount =
            getExpenseAmount(
              expense
            );

          totalExpense += amount;

          if (
            String(
              getStatus(
                expense
              )
            ).toUpperCase() ===
            "CANCELLED"
          ) {
            cancelledExpense +=
              amount;
          } else {
            activeExpense +=
              amount;
          }
        }
      );

      return {
        totalExpense,
        activeExpense,
        cancelledExpense,
        count:
          filteredExpenses.length,
      };
    }, [filteredExpenses]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredExpenses.length /
          itemsPerPage
      )
    );

  const paginatedExpenses =
    filteredExpenses.slice(
      (page - 1) *
        itemsPerPage,
      page * itemsPerPage
    );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
    fromDate,
    toDate,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setCategory("ALL");
    setFromDate("");
    setToDate("");
  }

  /* =======================================================
     RENDER
  ======================================================= */

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

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
              <TrendingDown
                size={23}
              />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Finance
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Expenses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage society expenses, bills and payments
              </p>

            </div>

          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <button
              type="button"
              onClick={
                loadExpenses
              }
              disabled={
                refreshing
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

            <Link
              href="/expenses/add"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Expense
            </Link>

          </div>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Total Records"
            value={
              summary.count
            }
            icon={
              <FileText size={20} />
            }
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(
              summary.totalExpense
            )}
            icon={
              <IndianRupee
                size={20}
              />
            }
            iconClass="bg-red-50 text-red-600"
          />

          <SummaryCard
            title="Active Expenses"
            value={formatCurrency(
              summary.activeExpense
            )}
            icon={
              <TrendingDown
                size={20}
              />
            }
            iconClass="bg-orange-50 text-orange-600"
          />

          <SummaryCard
            title="Cancelled Amount"
            value={formatCurrency(
              summary.cancelledExpense
            )}
            icon={
              <AlertCircle
                size={20}
              />
            }
            iconClass="bg-slate-100 text-slate-600"
          />

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_200px_170px_170px_auto]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search category, vendor, bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >

              <option value="ALL">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={
                      item._id ||
                      item.id ||
                      item.name
                    }
                    value={
                      item._id ||
                      item.id ||
                      item.name
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>

            {/* FROM DATE */}

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* TO DATE */}

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Expense Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredExpenses.length} records displayed
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <WalletCards size={15} />
              Society Expenses
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Vendor
                  </th>

                  <th className="px-5 py-4">
                    Bill No.
                  </th>

                  <th className="px-5 py-4">
                    Particular
                  </th>

                  <th className="px-5 py-4">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-right">
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <LoadingRows />
                ) : paginatedExpenses.length ===
                  0 ? (
                  <EmptyRow />
                ) : (
                  paginatedExpenses.map(
                    (expense) => (
                      <tr
                        key={
                          expense._id
                        }
                        className="transition hover:bg-slate-50/80"
                      >

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            expense.date
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <span className="font-semibold text-slate-800">
                            {getCategoryName(
                              expense
                            )}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <p className="max-w-[170px] truncate text-sm font-medium text-slate-700">
                            {getVendorName(
                              expense
                            )}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-indigo-600">
                          {getBillNumber(
                            expense
                          )}
                        </td>

                        <td className="max-w-[280px] px-5 py-4">

                          <p className="truncate text-sm text-slate-600">
                            {getDescription(
                              expense
                            )}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <PaymentModeBadge
                            mode={getPaymentMode(
                              expense
                            )}
                          />

                        </td>

                        <td className="px-5 py-4 text-right">

                          <span className="font-bold text-red-600">
                            {formatCurrency(
                              getExpenseAmount(
                                expense
                              )
                            )}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={getStatus(
                              expense
                            )}
                          />

                        </td>

                        <td className="px-5 py-4 text-center">

                          {expense._id ? (
                            <Link
                              href={`/expenses/${expense._id}`}
                              title="View expense"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <Eye
                                size={16}
                              />
                            </Link>
                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="space-y-3 lg:hidden">

          {loading ? (
            <LoadingCards />
          ) : paginatedExpenses.length ===
            0 ? (
            <EmptyCard />
          ) : (
            paginatedExpenses.map(
              (expense) => (
                <ExpenseCard
                  key={
                    expense._id
                  }
                  expense={
                    expense
                  }
                />
              )
            )
          )}

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filteredExpenses.length >
            0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">

                Showing{" "}

                <span className="font-semibold text-slate-700">
                  {(page - 1) *
                      itemsPerPage +
                    1}
                </span>

                {" - "}

                <span className="font-semibold text-slate-700">
                  {Math.min(
                    page *
                      itemsPerPage,
                    filteredExpenses.length
                  )}
                </span>

                {" of "}

                <span className="font-semibold text-slate-700">
                  {
                    filteredExpenses.length
                  }
                </span>

              </p>

              <div className="flex items-center justify-end gap-2">

                <button
                  type="button"
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1
                    )
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-950 px-3 text-xs font-bold text-white">
                  {page}
                </div>

                <button
                  type="button"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight
                    size={17}
                  />
                </button>

              </div>

            </div>
          )}

      </div>

    </AppShell>
  );
}