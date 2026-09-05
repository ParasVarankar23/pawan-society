"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

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

const getBalance = (entry) =>
  Number(entry.balance ?? entry.runningBalance ?? 0);

const getTransactionLabel = (type) => {
  const labels = {
    BILL: "Bill",
    PAYMENT: "Payment",
    PENALTY: "Penalty",
    ADJUSTMENT: "Adjustment",
    OPENING_BALANCE: "Opening Balance",
    CREDIT: "Credit",
    DEBIT: "Debit",
  };

  return labels[type] || type || "Transaction";
};

const getTransactionStyle = (type) => {
  if (type === "PAYMENT" || type === "CREDIT") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    type === "BILL" ||
    type === "PENALTY" ||
    type === "DEBIT"
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
};

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
   LOADING CARDS
========================================================= */

function LoadingCards() {
  return Array.from({ length: 5 }).map((_, index) => (
    <div
      key={index}
      className="h-44 animate-pulse rounded-2xl bg-white"
    />
  ));
}

/* =========================================================
   EMPTY DESKTOP ROW
========================================================= */

function EmptyRow() {
  return (
    <tr>
      <td
        colSpan={9}
        className="px-5 py-16 text-center"
      >
        <WalletCards
          size={40}
          className="mx-auto text-slate-300"
        />

        <p className="mt-4 font-semibold text-slate-700">
          No ledger entries found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Try changing your filters or search.
        </p>
      </td>
    </tr>
  );
}

/* =========================================================
   EMPTY MOBILE CARD
========================================================= */

function EmptyCard() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
      <WalletCards
        size={40}
        className="mx-auto text-slate-300"
      />

      <p className="mt-4 font-semibold text-slate-700">
        No ledger entries found
      </p>

      <p className="mt-1 text-sm text-slate-400">
        Try changing your filters or search.
      </p>
    </div>
  );
}

/* =========================================================
   MOBILE LEDGER CARD
========================================================= */

function LedgerCard({ entry }) {
  const roomNumber =
    entry.roomId?.roomNumber ||
    entry.roomNumber ||
    "-";

  const memberName =
    entry.memberId?.name ||
    entry.memberName ||
    "Unknown Member";

  const balance = getBalance(entry);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {formatDate(entry.date)}
          </p>

          <h3 className="mt-1 truncate font-bold text-slate-900">
            {memberName}
          </h3>

          <p className="mt-0.5 text-sm font-semibold text-indigo-600">
            Room {roomNumber}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${getTransactionStyle(
            entry.transactionType
          )}`}
        >
          {getTransactionLabel(
            entry.transactionType
          )}
        </span>
      </div>

      {/* Description */}
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Particular
        </p>

        <p className="mt-1 text-sm text-slate-700">
          {entry.description || "-"}
        </p>
      </div>

      {/* Amounts */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-red-50 p-3">
          <p className="text-[10px] text-red-500">
            Debit
          </p>

          <p className="mt-1 text-sm font-bold text-red-600">
            {formatCurrency(
              entry.debit || 0
            )}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-[10px] text-emerald-600">
            Credit
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-600">
            {formatCurrency(
              entry.credit || 0
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] text-slate-400">
            Balance
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              balance > 0
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Reference */}
      {(entry.referenceId ||
        entry.reference) && (
        <div className="mt-3 text-xs text-slate-400">
          Reference:{" "}
          <span className="font-medium text-slate-600">
            {entry.referenceId ||
              entry.reference}
          </span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function LedgerPage() {
  const [entries, setEntries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("ALL");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [page, setPage] =
    useState(1);

  const itemsPerPage = 10;

  /* =======================================================
     LOAD LEDGER
  ======================================================= */

  async function loadLedger() {
    try {
      setRefreshing(true);

      const params =
        new URLSearchParams();

      if (type !== "ALL") {
        params.set(
          "transactionType",
          type
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

      const response = await fetch(
        `/api/ledger${
          query ? `?${query}` : ""
        }`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to load ledger."
        );
      }

      if (result.success) {
        const data =
          Array.isArray(result.data)
            ? result.data
            : result.data?.entries ||
              result.data?.ledger ||
              [];

        setEntries(data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error(
        "Failed to load ledger:",
        error
      );

      setEntries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLedger();
  }, [type, fromDate, toDate]);

  /* =======================================================
     FILTER SEARCH
  ======================================================= */

  const filteredEntries =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return entries;
      }

      return entries.filter(
        (entry) => {
          const roomNumber =
            entry.roomId
              ?.roomNumber ||
            entry.roomNumber ||
            "";

          const memberName =
            entry.memberId?.name ||
            entry.memberName ||
            "";

          const description =
            entry.description ||
            "";

          const reference =
            entry.referenceId ||
            entry.reference ||
            "";

          const transactionType =
            entry.transactionType ||
            "";

          return [
            roomNumber,
            memberName,
            description,
            reference,
            transactionType,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        }
      );
    }, [entries, search]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      return filteredEntries.reduce(
        (result, entry) => {
          result.debit += Number(
            entry.debit || 0
          );

          result.credit += Number(
            entry.credit || 0
          );

          return result;
        },
        {
          debit: 0,
          credit: 0,
        }
      );
    }, [filteredEntries]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredEntries.length /
          itemsPerPage
      )
    );

  const paginatedEntries =
    filteredEntries.slice(
      (page - 1) *
        itemsPerPage,
      page * itemsPerPage
    );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    type,
    fromDate,
    toDate,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setType("ALL");
    setFromDate("");
    setToDate("");
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AppShell>
      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <BookOpen size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Finance
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Ledger
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Complete member and society transaction history
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={loadLedger}
            disabled={refreshing}
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

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Total Entries"
            value={
              filteredEntries.length
            }
            icon={
              <BookOpen size={20} />
            }
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            title="Total Debit"
            value={formatCurrency(
              summary.debit
            )}
            icon={
              <ArrowUpRight
                size={20}
              />
            }
            iconClass="bg-red-50 text-red-600"
          />

          <SummaryCard
            title="Total Credit"
            value={formatCurrency(
              summary.credit
            )}
            icon={
              <ArrowDownLeft
                size={20}
              />
            }
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_180px_170px_170px_auto]">

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
                placeholder="Search room, member, description..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* TYPE */}

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="ALL">
                All Transactions
              </option>

              <option value="BILL">
                Bill
              </option>

              <option value="PAYMENT">
                Payment
              </option>

              <option value="PENALTY">
                Penalty
              </option>

              <option value="ADJUSTMENT">
                Adjustment
              </option>

              <option value="OPENING_BALANCE">
                Opening Balance
              </option>

              <option value="CREDIT">
                Credit
              </option>

              <option value="DEBIT">
                Debit
              </option>
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
              <Filter size={16} />
              Clear
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
                Ledger Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredEntries.length} entries displayed
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <WalletCards size={15} />
              Transaction Ledger
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Room
                  </th>

                  <th className="px-5 py-4">
                    Member
                  </th>

                  <th className="px-5 py-4">
                    Particular
                  </th>

                  <th className="px-5 py-4">
                    Type
                  </th>

                  <th className="px-5 py-4 text-right">
                    Debit
                  </th>

                  <th className="px-5 py-4 text-right">
                    Credit
                  </th>

                  <th className="px-5 py-4 text-right">
                    Balance
                  </th>

                  <th className="px-5 py-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <LoadingRows />
                ) : paginatedEntries.length ===
                  0 ? (
                  <EmptyRow />
                ) : (
                  paginatedEntries.map(
                    (entry) => {
                      const balance =
                        getBalance(
                          entry
                        );

                      const roomNumber =
                        entry.roomId
                          ?.roomNumber ||
                        entry.roomNumber ||
                        "-";

                      const memberName =
                        entry.memberId
                          ?.name ||
                        entry.memberName ||
                        "-";

                      return (
                        <tr
                          key={
                            entry._id
                          }
                          className="transition hover:bg-slate-50/80"
                        >

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(
                              entry.date
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <span className="font-bold text-slate-900">
                              {
                                roomNumber
                              }
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <p className="max-w-[180px] truncate font-semibold text-slate-800">
                              {
                                memberName
                              }
                            </p>

                          </td>

                          <td className="max-w-[280px] px-5 py-4">

                            <p className="truncate text-sm text-slate-600">
                              {
                                entry.description ||
                                "-"
                              }
                            </p>

                            {(entry.referenceId ||
                              entry.reference) && (
                              <p className="mt-1 truncate text-[11px] text-slate-400">
                                Ref:{" "}
                                {entry.referenceId ||
                                  entry.reference}
                              </p>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getTransactionStyle(
                                entry.transactionType
                              )}`}
                            >
                              {getTransactionLabel(
                                entry.transactionType
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-red-600">
                            {entry.debit
                              ? formatCurrency(
                                  entry.debit
                                )
                              : "-"}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                            {entry.credit
                              ? formatCurrency(
                                  entry.credit
                                )
                              : "-"}
                          </td>

                          <td className="px-5 py-4 text-right">

                            <span
                              className={
                                balance >
                                0
                                  ? "font-bold text-red-600"
                                  : "font-bold text-emerald-600"
                              }
                            >
                              {formatCurrency(
                                balance
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-center">

                            {roomNumber !==
                            "-" ? (
                              <Link
                                href={`/ledger?room=${encodeURIComponent(
                                  roomNumber
                                )}`}
                                title="View room ledger"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <Eye
                                  size={
                                    16
                                  }
                                />
                              </Link>
                            ) : (
                              "-"
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="space-y-3 lg:hidden">

          {loading ? (
            <LoadingCards />
          ) : paginatedEntries.length ===
            0 ? (
            <EmptyCard />
          ) : (
            paginatedEntries.map(
              (entry) => (
                <LedgerCard
                  key={entry._id}
                  entry={entry}
                />
              )
            )
          )}

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filteredEntries.length >
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
                    filteredEntries.length
                  )}
                </span>

                {" of "}

                <span className="font-semibold text-slate-700">
                  {
                    filteredEntries.length
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