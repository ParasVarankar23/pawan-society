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

function WaterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />
      <path d="M9 16a3.5 3.5 0 0 0 3 1.5" />
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

function GaugeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 12l4-4" />
      <path d="M6 19h12" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <span className="text-lg font-bold">₹</span>
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
    blue:
      "bg-blue-50 text-blue-600",
    cyan:
      "bg-cyan-50 text-cyan-600",
    emerald:
      "bg-emerald-50 text-emerald-600",
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
   MOBILE CARD
========================================================= */

function ReadingCard({ reading }) {
  const room =
    reading.roomId?.roomNumber || "-";

  const member =
    reading.memberId?.name || "-";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-bold text-slate-950">
            Room {room}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {member}
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
          Recorded
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Previous
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {reading.previousReading ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Current
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {reading.currentReading ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-[9px] uppercase tracking-wide text-blue-400">
            Units
          </p>

          <p className="mt-1 text-sm font-bold text-blue-700">
            {reading.units ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

        <div>
          <p className="text-[10px] text-slate-400">
            Rate
          </p>

          <p className="text-xs font-semibold text-slate-700">
            {money(reading.ratePerUnit)}/unit
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-400">
            Amount
          </p>

          <p className="text-sm font-bold text-slate-950">
            {money(reading.amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function WaterPage() {
  const [readings, setReadings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [month, setMonth] =
    useState(currentMonth());

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadReadings() {
    setLoading(true);
    setError("");

    try {
      const result =
        await api.get(
          `/water/readings?billingMonth=${month}`
        );

      const list =
        Array.isArray(result.data)
          ? result.data
          : result.data?.readings || [];

      setReadings(list);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load water readings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReadings();
  }, [month]);

  const filteredReadings = useMemo(() => {
    if (!search.trim()) {
      return readings;
    }

    const query =
      search.toLowerCase();

    return readings.filter(
      (reading) => {
        const room =
          reading.roomId?.roomNumber ||
          "";

        const member =
          reading.memberId?.name ||
          "";

        return (
          room
            .toLowerCase()
            .includes(query) ||
          member
            .toLowerCase()
            .includes(query)
        );
      }
    );
  }, [readings, search]);

  const summary = useMemo(() => {
    const units =
      readings.reduce(
        (total, item) =>
          total +
          Number(item.units || 0),
        0
      );

    const amount =
      readings.reduce(
        (total, item) =>
          total +
          Number(item.amount || 0),
        0
      );

    return {
      readings: readings.length,
      units,
      amount,
      average: readings.length
        ? units / readings.length
        : 0,
    };
  }, [readings]);

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
              Utility Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Water Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Record meter readings and calculate
              monthly water charges.
            </p>
          </div>

          <Link
            href="/water/readings"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <PlusIcon />
            Add Reading
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

          <StatCard
            title="Readings"
            value={summary.readings}
            subtitle="This month"
            icon={<GaugeIcon />}
          />

          <StatCard
            title="Total Units"
            value={summary.units.toFixed(2)}
            subtitle="Units consumed"
            type="blue"
            icon={<WaterIcon />}
          />

          <StatCard
            title="Water Charges"
            value={money(summary.amount)}
            subtitle="Current month"
            type="cyan"
            icon={<RupeeIcon />}
          />

          <StatCard
            title="Average Usage"
            value={`${summary.average.toFixed(
              2
            )} units`}
            subtitle="Per registered reading"
            type="emerald"
            icon={<GaugeIcon />}
          />
        </div>

        {/* FILTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

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
                placeholder="Search room or member..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <input
              type="month"
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 lg:w-48"
            />

            <button
              onClick={loadReadings}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">
              Water Readings
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredReadings.length} reading
              {filteredReadings.length === 1
                ? ""
                : "s"} for {month}
            </p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredReadings.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <WaterIcon />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No water readings
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                No readings were found for the
                selected month.
              </p>

              <Link
                href="/water/readings"
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <PlusIcon />
                Add Reading
              </Link>
            </div>
          ) : (
            <>
              {/* MOBILE */}
              <div className="space-y-3 bg-slate-50 p-4 md:hidden">
                {filteredReadings.map(
                  (reading) => (
                    <ReadingCard
                      key={reading._id}
                      reading={reading}
                    />
                  )
                )}
              </div>

              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[950px] text-sm">

                  <thead className="bg-slate-50/70">
                    <tr className="border-b border-slate-100">

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Room
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Member
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Previous
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Current
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Units
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Rate
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Amount
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredReadings.map(
                      (reading) => (
                        <tr
                          key={
                            reading._id
                          }
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                        >

                          <td className="px-5 py-4">
                            <span className="font-bold text-slate-900">
                              {reading.roomId
                                ?.roomNumber ||
                                "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {reading.memberId
                              ?.name ||
                              "-"}
                          </td>

                          <td className="px-5 py-4 text-right text-slate-600">
                            {reading.previousReading ??
                              0}
                          </td>

                          <td className="px-5 py-4 text-right font-medium text-slate-800">
                            {reading.currentReading ??
                              0}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="font-bold text-blue-700">
                              {Number(
                                reading.units ||
                                  0
                              ).toFixed(2)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right text-slate-600">
                            {money(
                              reading.ratePerUnit
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-slate-950">
                            {money(
                              reading.amount
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                              Recorded
                            </span>
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