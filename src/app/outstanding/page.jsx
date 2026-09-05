"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  IndianRupee,
  RefreshCw,
  Search,
  Users,
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

const getOutstandingAmount = (item) =>
  Number(
    item.balanceAmount ??
      item.outstandingAmount ??
      item.balance ??
      item.amountDue ??
      0
  );

const getRoomNumber = (item) =>
  item.roomId?.roomNumber ||
  item.roomNumber ||
  item.room?.roomNumber ||
  "-";

const getMemberName = (item) =>
  item.memberId?.name ||
  item.memberName ||
  item.member?.name ||
  "Unknown Member";

const getMemberEmail = (item) =>
  item.memberId?.email ||
  item.memberEmail ||
  item.member?.email ||
  "";

const getMemberMobile = (item) =>
  item.memberId?.mobile ||
  item.mobile ||
  item.member?.mobile ||
  "";

const getBillNumber = (item) =>
  item.billNumber ||
  item.billId?.billNumber ||
  item.bill?.billNumber ||
  "-";

const getBillingMonth = (item) =>
  item.billingMonth ||
  item.billId?.billingMonth ||
  item.bill?.billingMonth ||
  "-";

const getDueDate = (item) =>
  item.dueDate ||
  item.billId?.dueDate ||
  item.bill?.dueDate ||
  null;

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
      {Array.from({ length: 8 }).map((__, cellIndex) => (
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
      className="h-48 animate-pulse rounded-2xl bg-white"
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
        colSpan={8}
        className="px-5 py-16 text-center"
      >
        <WalletCards
          size={42}
          className="mx-auto text-slate-300"
        />

        <p className="mt-4 font-semibold text-slate-700">
          No outstanding amounts found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          All dues may be cleared or your filters returned no records.
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
        No outstanding amounts found
      </p>

      <p className="mt-1 text-sm text-slate-400">
        All dues may be cleared or your filters returned no records.
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function OutstandingBadge({ amount }) {
  if (amount <= 0) {
    return (
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
      Outstanding
    </span>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function OutstandingCard({
  item,
}) {
  const roomNumber =
    getRoomNumber(item);

  const memberName =
    getMemberName(item);

  const amount =
    getOutstandingAmount(item);

  const billNumber =
    getBillNumber(item);

  const billingMonth =
    getBillingMonth(item);

  const dueDate =
    getDueDate(item);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* Header */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="text-xs text-slate-400">
            Room
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-slate-900">
            {roomNumber}
          </h3>

          <p className="mt-0.5 truncate text-sm font-medium text-slate-600">
            {memberName}
          </p>

        </div>

        <OutstandingBadge
          amount={amount}
        />

      </div>

      {/* Bill */}

      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Bill Number
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {billNumber}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Billing Month
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {billingMonth}
          </p>
        </div>

      </div>

      {/* Due Date */}

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

        <CalendarDays size={15} />

        Due Date:
        <span className="font-semibold text-slate-700">
          {formatDate(dueDate)}
        </span>

      </div>

      {/* Amount */}

      <div className="mt-4 flex items-center justify-between rounded-xl bg-red-50 p-4">

        <div>
          <p className="text-xs font-medium text-red-500">
            Amount Outstanding
          </p>

          <p className="mt-1 text-xl font-bold text-red-700">
            {formatCurrency(amount)}
          </p>
        </div>

        {roomNumber !== "-" && (
          <Link
            href={`/members?room=${encodeURIComponent(
              roomNumber
            )}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-100"
            title="View member"
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

export default function OutstandingPage() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [billingMonth, setBillingMonth] =
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
     LOAD OUTSTANDING
  ======================================================= */

  async function loadOutstanding() {
    try {
      setRefreshing(true);

      const params =
        new URLSearchParams();

      if (billingMonth) {
        params.set(
          "billingMonth",
          billingMonth
        );
      }

      const query =
        params.toString();

      const response =
        await api.get(
          `/billing/outstanding${
            query ? `?${query}` : ""
          }`
        );

      const data =
        Array.isArray(response?.data)
          ? response.data
          : response?.data?.items ||
            response?.data?.outstanding ||
            response?.data?.bills ||
            [];

      setItems(data);
    } catch (error) {
      console.error(
        "Failed to load outstanding:",
        error
      );

      setItems([]);

      showToast(
        error?.message ||
          "Failed to load outstanding amounts.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOutstanding();
  }, [billingMonth]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter(
        (item) => {
          const room =
            getRoomNumber(item);

          const member =
            getMemberName(item);

          const mobile =
            getMemberMobile(item);

          const email =
            getMemberEmail(item);

          const bill =
            getBillNumber(item);

          const month =
            getBillingMonth(item);

          return [
            room,
            member,
            mobile,
            email,
            bill,
            month,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        }
      );
    }, [items, search]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      let totalOutstanding = 0;
      let overdueCount = 0;

      filteredItems.forEach(
        (item) => {
          const amount =
            getOutstandingAmount(
              item
            );

          totalOutstanding +=
            amount;

          const dueDate =
            getDueDate(item);

          if (
            amount > 0 &&
            dueDate
          ) {
            const due =
              new Date(dueDate);

            if (
              !Number.isNaN(
                due.getTime()
              ) &&
              due <
                new Date()
            ) {
              overdueCount += 1;
            }
          }
        }
      );

      return {
        count:
          filteredItems.length,
        totalOutstanding,
        overdueCount,
      };
    }, [filteredItems]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredItems.length /
          itemsPerPage
      )
    );

  const paginatedItems =
    filteredItems.slice(
      (page - 1) *
        itemsPerPage,
      page * itemsPerPage
    );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    billingMonth,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setBillingMonth("");
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
              <AlertCircle size={23} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Finance
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Outstanding
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track pending maintenance and other member dues
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={loadOutstanding}
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
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Outstanding Members"
            value={
              summary.count
            }
            icon={
              <Users size={20} />
            }
            iconClass="bg-red-50 text-red-600"
          />

          <SummaryCard
            title="Total Outstanding"
            value={formatCurrency(
              summary.totalOutstanding
            )}
            icon={
              <IndianRupee
                size={20}
              />
            }
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Overdue Accounts"
            value={
              summary.overdueCount
            }
            icon={
              <AlertCircle
                size={20}
              />
            }
            iconClass="bg-orange-50 text-orange-600"
          />

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">

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
                placeholder="Search room, member, mobile, bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* MONTH */}

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="month"
                value={billingMonth}
                onChange={(event) =>
                  setBillingMonth(
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
                Outstanding Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredItems.length} outstanding records
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <WalletCards size={15} />
              Pending Collections
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-4">
                    Room
                  </th>

                  <th className="px-5 py-4">
                    Member
                  </th>

                  <th className="px-5 py-4">
                    Bill No.
                  </th>

                  <th className="px-5 py-4">
                    Month
                  </th>

                  <th className="px-5 py-4">
                    Due Date
                  </th>

                  <th className="px-5 py-4 text-right">
                    Outstanding
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
                ) : paginatedItems.length ===
                  0 ? (
                  <EmptyRow />
                ) : (
                  paginatedItems.map(
                    (item) => {
                      const roomNumber =
                        getRoomNumber(
                          item
                        );

                      const memberName =
                        getMemberName(
                          item
                        );

                      const amount =
                        getOutstandingAmount(
                          item
                        );

                      const dueDate =
                        getDueDate(
                          item
                        );

                      return (
                        <tr
                          key={
                            item._id ||
                            `${roomNumber}-${getBillNumber(
                              item
                            )}`
                          }
                          className="transition hover:bg-slate-50/80"
                        >

                          <td className="px-5 py-4">

                            <span className="font-bold text-slate-900">
                              {
                                roomNumber
                              }
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <p className="max-w-[210px] truncate font-semibold text-slate-800">
                              {
                                memberName
                              }
                            </p>

                            {getMemberMobile(
                              item
                            ) && (
                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  getMemberMobile(
                                    item
                                  )
                                }
                              </p>
                            )}

                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-indigo-600">
                            {
                              getBillNumber(
                                item
                              )
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {
                              getBillingMonth(
                                item
                              )
                            }
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {
                              formatDate(
                                dueDate
                              )
                            }
                          </td>

                          <td className="px-5 py-4 text-right">

                            <span className="font-bold text-red-600">
                              {formatCurrency(
                                amount
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <OutstandingBadge
                              amount={
                                amount
                              }
                            />

                          </td>

                          <td className="px-5 py-4 text-center">

                            {item.billId?._id ||
                            item.bill?._id ||
                            item._id ? (
                              <Link
                                href={`/billing/${
                                  item.billId?._id ||
                                  item.bill?._id ||
                                  item._id
                                }`}
                                title="View bill"
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
            MOBILE CARDS
        ================================================= */}

        <div className="space-y-3 lg:hidden">

          {loading ? (
            <LoadingCards />
          ) : paginatedItems.length ===
            0 ? (
            <EmptyCard />
          ) : (
            paginatedItems.map(
              (item) => (
                <OutstandingCard
                  key={
                    item._id ||
                    `${getRoomNumber(
                      item
                    )}-${getBillNumber(
                      item
                    )}`
                  }
                  item={item}
                />
              )
            )
          )}

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filteredItems.length >
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
                    filteredItems.length
                  )}
                </span>

                {" of "}

                <span className="font-semibold text-slate-700">
                  {
                    filteredItems.length
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