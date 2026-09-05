"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

/* =========================================================
   ICONS
========================================================= */

function RoomsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
      <path d="M3 21h18" />
      <path d="M7 7h3" />
      <path d="M14 7h3" />
      <path d="M7 11h3" />
      <path d="M14 11h3" />
      <path d="M9 21v-5h6v5" />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M16 4.5a4 4 0 0 1 0 7.5" />
      <path d="M17 14a6 6 0 0 1 5 7" />
    </svg>
  );
}

function OutstandingIcon() {
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

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M3 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
      <path d="M3 6a2 2 0 0 1 2-2h13" />
      <path d="M16 13h5" />
      <circle cx="16" cy="13" r=".5" />
    </svg>
  );
}

function IncomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
      <path d="M4 21h16" />
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h4" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
      />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString(
    "en-IN"
  )}`;
}

function formatCompactCurrency(value) {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(
      amount / 10000000
    ).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(
      amount / 100000
    ).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(
      amount / 1000
    ).toFixed(1)}K`;
  }

  return `₹${amount}`;
}

function getInitials(name) {
  if (!name) return "M";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
  variant = "default",
}) {
  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
            ${
              variant === "danger"
                ? "bg-red-50 text-red-600"
                : variant === "success"
                ? "bg-emerald-50 text-emerald-600"
                : variant === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-700"
            }
          `}
        >
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 transition group-hover:text-slate-950">
          View details
          <ArrowIcon />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View all",
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950"
        >
          {linkText}
          <ArrowIcon />
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-slate-500">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-8 text-sm"
        >
          <span className="text-slate-500">
            {item.name}
          </span>

          <span className="font-bold text-slate-900">
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      <div>
        <div className="h-8 w-48 rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-72 rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl border bg-white"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="h-80 rounded-2xl border bg-white xl:col-span-2" />
        <div className="h-80 rounded-2xl border bg-white" />
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        const result =
          await api.get(
            "/dashboard"
          );

        if (mounted) {
          setData(result.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.message ||
              "Unable to load dashboard."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     NORMALIZE CHART DATA
  ===================================================== */

  const monthlyData = useMemo(() => {
    return (
      data?.monthly ||
      data?.monthlySummary ||
      data?.monthlyData ||
      data?.chartData ||
      []
    );
  }, [data]);

  const collectionData = useMemo(() => {
    return (
      data?.collectionTrend ||
      data?.collection ||
      monthlyData
    );
  }, [data, monthlyData]);

  const recentPayments =
    data?.recentPayments ||
    data?.payments ||
    [];

  const overdueBills =
    data?.overdueBills ||
    data?.overdue ||
    [];

  /* =====================================================
     ROOM STATUS DATA
  ===================================================== */

  const roomStatusData = useMemo(() => {
    if (data?.roomStatus) {
      return data.roomStatus;
    }

    return [
      {
        name: "Occupied",
        value:
          Number(
            data?.occupiedRooms
          ) || 0,
      },
      {
        name: "Rented",
        value:
          Number(
            data?.rentedRooms
          ) || 0,
      },
      {
        name: "Vacant",
        value:
          Number(
            data?.vacantRooms
          ) || 0,
      },
    ].filter(
      (item) => item.value > 0
    );
  }, [data]);

  /* =====================================================
     CURRENT MONTH
  ===================================================== */

  const currentMonth =
    data?.currentMonth ||
    data?.billingMonth ||
    new Date().toLocaleString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  return (
    <AppShell>
      <Toast
        message={error}
        onClose={() => setError("")}
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Overview
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Society overview and financial
                summary for {currentMonth}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <Link
                href="/payments"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <PaymentIcon />
                Record Payment
              </Link>

              <Link
                href="/billing/generate"
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <BillIcon />
                Generate Bills
              </Link>
            </div>
          </div>

          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Rooms"
              value={
                data?.totalRooms ?? 0
              }
              subtitle="Registered society rooms"
              href="/rooms"
              icon={<RoomsIcon />}
            />

            <StatCard
              title="Total Members"
              value={
                data?.totalMembers ?? 0
              }
              subtitle="Registered members"
              href="/members"
              icon={<MembersIcon />}
            />

            <StatCard
              title="Outstanding"
              value={formatCompactCurrency(
                data?.outstanding
              )}
              subtitle="Amount currently due"
              href="/outstanding"
              variant="danger"
              icon={<OutstandingIcon />}
            />

            <StatCard
              title="Current Balance"
              value={formatCompactCurrency(
                data?.currentBalance
              )}
              subtitle="Available society balance"
              href="/cashbook"
              variant="success"
              icon={<WalletIcon />}
            />
          </div>

          {/* =================================================
              FINANCIAL CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <StatCard
              title="Total Collection"
              value={formatCurrency(
                data?.totalCollection
              )}
              subtitle="Member payments received"
              href="/payments"
              variant="success"
              icon={<PaymentIcon />}
            />

            <StatCard
              title="Total Income"
              value={formatCurrency(
                data?.totalIncome
              )}
              subtitle="All recorded society income"
              href="/reports/income"
              variant="success"
              icon={<IncomeIcon />}
            />

            <StatCard
              title="Total Expenses"
              value={formatCurrency(
                data?.totalExpenses
              )}
              subtitle="Recorded society expenses"
              href="/expenses"
              variant="warning"
              icon={<ExpenseIcon />}
            />
          </div>

          {/* =================================================
              CHART ROW
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* Income / Expense */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

              <SectionHeader
                title="Income & Expenses"
                subtitle="Monthly financial performance"
                href="/reports/monthly"
              />

              {monthlyData.length > 0 ? (
                <div className="h-[310px] w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={monthlyData}
                      margin={{
                        top: 10,
                        right: 5,
                        left: -15,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={
                          formatCompactCurrency
                        }
                      />

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                        cursor={{
                          fill: "#f8fafc",
                        }}
                      />

                      <Bar
                        dataKey="income"
                        name="Income"
                        fill="#0f172a"
                        radius={[
                          5,
                          5,
                          0,
                          0,
                        ]}
                        maxBarSize={28}
                      />

                      <Bar
                        dataKey="expense"
                        name="Expenses"
                        fill="#cbd5e1"
                        radius={[
                          5,
                          5,
                          0,
                          0,
                        ]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart
                  title="No monthly financial data"
                  description="Financial chart data will appear after transactions are recorded."
                />
              )}
            </div>

            {/* Room occupancy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionHeader
                title="Room Overview"
                subtitle="Current occupancy status"
                href="/rooms"
              />

              {roomStatusData.length > 0 ? (
                <>
                  <div className="h-[220px]">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={roomStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={62}
                          outerRadius={88}
                          paddingAngle={3}
                        >
                          {roomStatusData.map(
                            (_, index) => (
                              <Cell
                                key={
                                  index
                                }
                                fill={[
                                  "#0f172a",
                                  "#64748b",
                                  "#cbd5e1",
                                ][
                                  index %
                                    3
                                ]}
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(
                            value
                          ) => [
                            value,
                            "Rooms",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {roomStatusData.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.name
                          }
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  [
                                    "#0f172a",
                                    "#64748b",
                                    "#cbd5e1",
                                  ][
                                    index %
                                      3
                                  ],
                              }}
                            />

                            <span className="text-xs text-slate-500">
                              {item.name}
                            </span>
                          </div>

                          <span className="text-sm font-bold text-slate-900">
                            {item.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <EmptyChart
                  title="No room data"
                  description="Room occupancy information will appear here."
                />
              )}
            </div>
          </div>

          {/* =================================================
              COLLECTION TREND
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <SectionHeader
              title="Collection Trend"
              subtitle="Monthly member payment collection"
              href="/reports/collection"
            />

            {collectionData.length > 0 ? (
              <div className="h-[280px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={collectionData}
                    margin={{
                      top: 10,
                      right: 5,
                      left: -15,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="collectionGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0f172a"
                          stopOpacity={0.16}
                        />

                        <stop
                          offset="95%"
                          stopColor="#0f172a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={
                        formatCompactCurrency
                      }
                    />

                    <Tooltip
                      content={
                        <ChartTooltip />
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="collection"
                      name="Collection"
                      stroke="#0f172a"
                      strokeWidth={2.5}
                      fill="url(#collectionGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart
                title="No collection history"
                description="Collection data will appear here as member payments are recorded."
              />
            )}
          </div>

          {/* =================================================
              LOWER SECTION
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* Recent payments */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="p-5 pb-3">
                <SectionHeader
                  title="Recent Payments"
                  subtitle="Latest member payments"
                  href="/payments"
                />
              </div>

              {recentPayments.length > 0 ? (
                <div className="divide-y divide-slate-100">

                  {recentPayments
                    .slice(0, 6)
                    .map(
                      (payment) => {
                        const member =
                          payment.memberId ||
                          payment.member;

                        const name =
                          member?.name ||
                          payment.memberName ||
                          "Member";

                        const room =
                          payment.roomId?.roomNumber ||
                          payment.roomNumber ||
                          "-";

                        return (
                          <div
                            key={
                              payment._id ||
                              payment.id
                            }
                            className="flex items-center justify-between gap-4 px-5 py-4"
                          >

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                                {getInitials(
                                  name
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Room {room}
                                  {" · "}
                                  {payment.paymentMode ||
                                    "Payment"}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-emerald-600">
                                +
                                {formatCurrency(
                                  payment.amount
                                )}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {payment.paymentDate
                                  ? new Date(
                                      payment.paymentDate
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}

                </div>
              ) : (
                <EmptyList
                  title="No payments yet"
                  description="Recorded payments will appear here."
                />
              )}
            </div>

            {/* Overdue bills */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="p-5 pb-3">
                <SectionHeader
                  title="Outstanding Bills"
                  subtitle="Bills requiring attention"
                  href="/outstanding"
                />
              </div>

              {overdueBills.length > 0 ? (
                <div className="divide-y divide-slate-100">

                  {overdueBills
                    .slice(0, 6)
                    .map(
                      (bill) => {
                        const member =
                          bill.memberId ||
                          bill.member;

                        const name =
                          member?.name ||
                          bill.memberName ||
                          "Member";

                        const room =
                          bill.roomId?.roomNumber ||
                          bill.roomNumber ||
                          "-";

                        const amount =
                          bill.balanceAmount ??
                          bill.outstanding ??
                          bill.totalOutstanding ??
                          0;

                        return (
                          <div
                            key={
                              bill._id ||
                              bill.id
                            }
                            className="flex items-center justify-between gap-4 px-5 py-4"
                          >

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <OutstandingIcon />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Room {room}
                                  {" · "}
                                  {bill.billingMonth ||
                                    "Bill"}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-red-600">
                                {formatCurrency(
                                  amount
                                )}
                              </p>

                              <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                Due
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}

                </div>
              ) : (
                <EmptyList
                  title="No outstanding bills"
                  description="There are currently no bills requiring attention."
                />
              )}
            </div>
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div>
            <SectionHeader
              title="Quick Actions"
              subtitle="Frequently used society operations"
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

              <QuickAction
                href="/members/add"
                title="Add Member"
                icon={<MembersIcon />}
              />

              <QuickAction
                href="/rooms"
                title="Manage Rooms"
                icon={<RoomsIcon />}
              />

              <QuickAction
                href="/water/readings"
                title="Water Reading"
                icon={<WaterQuickIcon />}
              />

              <QuickAction
                href="/billing/generate"
                title="Generate Bills"
                icon={<BillIcon />}
              />

              <QuickAction
                href="/payments"
                title="Record Payment"
                icon={<PaymentIcon />}
              />

              <QuickAction
                href="/expenses/add"
                title="Add Expense"
                icon={<ExpenseIcon />}
              />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  title,
  icon,
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[100px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        {icon}
      </div>

      <span className="mt-3 text-xs font-semibold text-slate-600 group-hover:text-slate-950">
        {title}
      </span>
    </Link>
  );
}

/* =========================================================
   WATER QUICK ICON
========================================================= */

function WaterQuickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 2s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z" />
      <path d="M9 16a3.5 3.5 0 0 0 6 0" />
    </svg>
  );
}

/* =========================================================
   EMPTY CHART
========================================================= */

function EmptyChart({
  title,
  description,
}) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ReportsEmptyIcon />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY LIST
========================================================= */

function EmptyList({
  title,
  description,
}) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <PaymentIcon />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function ReportsEmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-3 3 2 5-6" />
    </svg>
  );
}