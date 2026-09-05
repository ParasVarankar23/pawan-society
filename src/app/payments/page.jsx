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

function BillIcon() {
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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

function RupeeIcon() {
  return (
    <span className="text-lg font-bold">
      ₹
    </span>
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

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
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

function currentMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatMonth(value) {
  if (!value) return "-";

  const date = new Date(
    `${value}-01T00:00:00`
  );

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
}

function statusClass(status) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "PARTIAL":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "OVERDUE":
      return "bg-red-50 text-red-700 border-red-100";

    case "UNPAID":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "GENERATED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function statusLabel(status) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
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

    amber:
      "bg-amber-50 text-amber-600",

    red:
      "bg-red-50 text-red-600",

    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

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
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[type]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MOBILE BILL CARD
========================================================= */

function BillCard({ bill }) {
  const room =
    bill.roomId?.roomNumber || "-";

  const member =
    bill.memberId?.name || "-";

  const total =
    Number(bill.totalOutstanding || 0);

  const paid =
    Number(bill.paidAmount || 0);

  const balance =
    Number(
      bill.balanceAmount ??
        total - paid
    );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-sm font-bold text-slate-950">
            Room {room}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {member}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Bill #{bill.billNumber || "-"}
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass(
            bill.status
          )}`}
        >
          {statusLabel(
            bill.status
          )}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Previous
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {money(
              bill.previousOutstanding
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Current
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {money(
              bill.subtotal
            )}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-amber-500">
            Penalty
          </p>

          <p className="mt-1 text-sm font-semibold text-amber-700">
            {money(
              bill.penalty?.amount
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Total
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {money(total)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

        <div>
          <p className="text-[10px] text-slate-400">
            Paid
          </p>

          <p className="text-xs font-semibold text-emerald-600">
            {money(paid)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-400">
            Balance
          </p>

          <p
            className={`text-sm font-bold ${
              balance > 0
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          >
            {money(balance)}
          </p>
        </div>
      </div>

      <Link
        href={`/billing/${bill._id}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
      >
        <EyeIcon />
        View Bill
      </Link>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function BillingPage() {
  const [bills, setBills] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [month, setMonth] =
    useState(currentMonth());

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadBills() {
    setLoading(true);
    setError("");

    try {
      const result =
        await api.get(
          `/billing?billingMonth=${month}`
        );

      const list =
        Array.isArray(result.data)
          ? result.data
          : result.data?.bills || [];

      setBills(list);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load bills."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [month]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (statusFilter !== "ALL") {
      result = result.filter(
        (bill) =>
          bill.status ===
          statusFilter
      );
    }

    if (search.trim()) {
      const query =
        search.toLowerCase();

      result = result.filter(
        (bill) => {
          const room =
            bill.roomId?.roomNumber ||
            "";

          const member =
            bill.memberId?.name ||
            "";

          const billNumber =
            String(
              bill.billNumber || ""
            );

          return (
            room
              .toLowerCase()
              .includes(query) ||
            member
              .toLowerCase()
              .includes(query) ||
            billNumber
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }

    return result;
  }, [
    bills,
    search,
    statusFilter,
  ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    bills.forEach((bill) => {
      const total =
        Number(
          bill.totalOutstanding || 0
        );

      const paid =
        Number(
          bill.paidAmount || 0
        );

      const balance =
        Number(
          bill.balanceAmount ??
            total - paid
        );

      totalBilled += total;
      totalPaid += paid;
      totalOutstanding += Math.max(
        balance,
        0
      );
    });

    return {
      total: bills.length,

      paid: bills.filter(
        (bill) =>
          bill.status === "PAID"
      ).length,

      unpaid: bills.filter(
        (bill) =>
          bill.status === "UNPAID" ||
          bill.status === "OVERDUE"
      ).length,

      partial: bills.filter(
        (bill) =>
          bill.status === "PARTIAL"
      ).length,

      totalBilled,
      totalPaid,
      totalOutstanding,
    };
  }, [bills]);

  return (
    <AppShell>

      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Finance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Monthly Billing
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Generate, review and manage monthly
              maintenance bills.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <Link
              href="/billing/generate"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <PlusIcon />
              Generate Bills
            </Link>
          </div>
        </div>

        {/* =================================================
            MONTH BANNER
        ================================================= */}

        <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Billing Period
              </p>

              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                {formatMonth(month)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Review all generated bills and
                outstanding amounts for this month.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <label className="text-xs text-slate-400">
                Select month
              </label>

              <input
                type="month"
                value={month}
                onChange={(event) =>
                  setMonth(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-500"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          <StatCard
            title="Total Bills"
            value={summary.total}
            subtitle="Generated this month"
            icon={<BillIcon />}
          />

          <StatCard
            title="Paid Bills"
            value={summary.paid}
            subtitle={`${summary.partial} partially paid`}
            type="emerald"
            icon={<CheckIcon />}
          />

          <StatCard
            title="Unpaid"
            value={summary.unpaid}
            subtitle="Requires collection"
            type="amber"
            icon={<ClockIcon />}
          />

          <StatCard
            title="Outstanding"
            value={money(
              summary.totalOutstanding
            )}
            subtitle="Balance to collect"
            type="red"
            icon={<AlertIcon />}
          />
        </div>

        {/* =================================================
            FINANCIAL SUMMARY
        ================================================= */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">
              Total Billed
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {money(
                summary.totalBilled
              )}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{
                  width: `${
                    summary.totalBilled
                      ? Math.min(
                          (summary.totalPaid /
                            summary.totalBilled) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
            <p className="text-xs text-emerald-700">
              Collected
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {money(
                summary.totalPaid
              )}
            </p>

            <p className="mt-2 text-[11px] text-emerald-600">
              Amount received against bills
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5 shadow-sm">
            <p className="text-xs text-red-600">
              Balance Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700">
              {money(
                summary.totalOutstanding
              )}
            </p>

            <p className="mt-2 text-[11px] text-red-500">
              Amount still to be collected
            </p>
          </div>
        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 xl:flex-row">

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
                placeholder="Search room, member or bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="relative xl:w-48">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PARTIAL">
                  Partial
                </option>

                <option value="UNPAID">
                  Unpaid
                </option>

                <option value="OVERDUE">
                  Overdue
                </option>

                <option value="GENERATED">
                  Generated
                </option>
              </select>
            </div>

            <button
              onClick={loadBills}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              Refresh
            </button>
          </div>
        </div>

        {/* =================================================
            BILL REGISTER
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bill Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredBills.length} bill
                {filteredBills.length === 1
                  ? ""
                  : "s"} displayed
              </p>
            </div>

            <Link
              href="/billing/generate"
              className="hidden items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white sm:flex"
            >
              <PlusIcon />
              Generate
            </Link>
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
          ) : filteredBills.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <BillIcon />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No bills found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                There are no bills matching the
                selected filters.
              </p>

              <Link
                href="/billing/generate"
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <PlusIcon />
                Generate Bills
              </Link>
            </div>
          ) : (
            <>
              {/* MOBILE */}
              <div className="space-y-3 bg-slate-50 p-4 lg:hidden">
                {filteredBills.map(
                  (bill) => (
                    <BillCard
                      key={bill._id}
                      bill={bill}
                    />
                  )
                )}
              </div>

              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1250px] text-sm">

                  <thead className="bg-slate-50/70">

                    <tr className="border-b border-slate-100">

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Bill
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Room / Member
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Previous
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Current
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Penalty
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Total
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Paid
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Balance
                      </th>

                      <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBills.map(
                      (bill) => {

                        const total =
                          Number(
                            bill.totalOutstanding ||
                              0
                          );

                        const paid =
                          Number(
                            bill.paidAmount ||
                              0
                          );

                        const balance =
                          Number(
                            bill.balanceAmount ??
                              total -
                                paid
                          );

                        return (
                          <tr
                            key={
                              bill._id
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >

                            <td className="px-5 py-4">

                              <p className="font-bold text-slate-900">
                                #
                                {
                                  bill.billNumber
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {
                                  bill.billingMonth
                                }
                              </p>

                            </td>

                            <td className="px-5 py-4">

                              <p className="font-semibold text-slate-900">
                                Room{" "}
                                {bill.roomId
                                  ?.roomNumber ||
                                  "-"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  bill
                                    .memberId
                                    ?.name
                                }
                              </p>

                            </td>

                            <td className="px-5 py-4 text-right text-slate-600">
                              {money(
                                bill.previousOutstanding
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-medium text-slate-800">
                              {money(
                                bill.subtotal
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-amber-600">
                              {money(
                                bill.penalty
                                  ?.amount
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-slate-950">
                              {money(
                                total
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                              {money(
                                paid
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">

                              <span
                                className={`font-bold ${
                                  balance >
                                  0
                                    ? "text-red-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {money(
                                  balance
                                )}
                              </span>

                            </td>

                            <td className="px-5 py-4 text-center">

                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass(
                                  bill.status
                                )}`}
                              >
                                {statusLabel(
                                  bill.status
                                )}
                              </span>

                            </td>

                            <td className="px-5 py-4 text-right">

                              <Link
                                href={`/billing/${bill._id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-950"
                              >
                                <EyeIcon />
                                View
                              </Link>

                            </td>

                          </tr>
                        );
                      }
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