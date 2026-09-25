"use client";

import {
  AlertCircle,
  ChevronDown,
  IndianRupee,
  RefreshCw,
  Search,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
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

function currentBillingMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function monthLabel(month) {
  if (!month) return "All months";

  return new Date(`${month}-01T00:00:00`).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
}

function getMonthOptions() {
  const options = [];
  const date = new Date();

  for (let offset = 0; offset < 24; offset += 1) {
    const optionDate = new Date(
      date.getFullYear(),
      date.getMonth() - offset,
      1
    );
    options.push(
      `${optionDate.getFullYear()}-${String(
        optionDate.getMonth() + 1
      ).padStart(2, "0")}`
    );
  }

  return options;
}

const monthOptions = getMonthOptions();

export default function OutstandingReportPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [billingMonth, setBillingMonth] = useState(currentBillingMonth);
  const [monthSearch, setMonthSearch] = useState("");
  const [monthOpen, setMonthOpen] = useState(false);
  const monthPickerRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        monthPickerRef.current &&
        !monthPickerRef.current.contains(event.target)
      ) {
        setMonthOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredMonths = monthOptions.filter((month) =>
    monthLabel(month).toLowerCase().includes(monthSearch.trim().toLowerCase())
  );

  async function loadReport() {
    try {
      setRefreshing(true);

      const query = billingMonth
        ? `?billingMonth=${encodeURIComponent(
          billingMonth
        )}`
        : "";

      const response = await api.get(
        `/reports/outstanding${query}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
        response?.data?.outstanding ||
        response?.data?.bills ||
        [];

      setItems(data);
    } catch (error) {
      setItems([]);

      showToast(
        error?.message ||
        "Failed to load outstanding report.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [billingMonth]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      [
        item.roomNumber,
        item.roomId?.roomNumber,
        item.memberName,
        item.memberId?.name,
        item.billNumber,
        item.billingMonth,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  const total = filteredItems.reduce(
    (sum, item) =>
      sum +
      Number(
        item.balanceAmount ??
        item.outstandingAmount ??
        item.balance ??
        0
      ),
    0
  );

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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
              <AlertCircle size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Reports
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Outstanding Report
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Pending member dues and overdue amounts.
              </p>
            </div>
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
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search room, member, bill..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div ref={monthPickerRef} className="relative">
              <button
                type="button"
                className="input flex h-11 w-full items-center justify-between text-left"
                onClick={() => setMonthOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={monthOpen}
              >
                <span className="text-sm text-slate-700">
                  {monthLabel(billingMonth)}
                </span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {monthOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-full min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <input
                    type="search"
                    value={monthSearch}
                    onChange={(event) => setMonthSearch(event.target.value)}
                    placeholder="Search month..."
                    className="input h-10 w-full"
                    aria-label="Search billing month"
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto" role="listbox">
                    {filteredMonths.map((month) => (
                      <button
                        key={month}
                        type="button"
                        role="option"
                        aria-selected={billingMonth === month}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${billingMonth === month ? "bg-slate-50 font-semibold text-slate-950" : "text-slate-700"}`}
                        onClick={() => {
                          setBillingMonth(month);
                          setMonthSearch("");
                          setMonthOpen(false);
                        }}
                      >
                        {monthLabel(month)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <p className="text-sm text-slate-500">
                Outstanding Members
              </p>
              <Users
                size={20}
                className="text-red-600"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredItems.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <p className="text-sm text-slate-500">
                Total Outstanding
              </p>
              <IndianRupee
                size={20}
                className="text-red-600"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Room</th>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Bill</th>
                  <th className="px-5 py-4">Month</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4 text-right">
                    Outstanding
                  </th>
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
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-4 font-semibold text-slate-700">
                        No outstanding records found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    const amount = Number(
                      item.balanceAmount ??
                      item.outstandingAmount ??
                      item.balance ??
                      0
                    );

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {item.roomNumber ||
                            item.roomId?.roomNumber ||
                            "-"}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.memberName ||
                            item.memberId?.name ||
                            "-"}
                        </td>

                        <td className="px-5 py-4 text-indigo-600">
                          {item.billNumber || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.billingMonth || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(item.dueDate)}
                        </td>

                        <td className="px-5 py-4 text-right font-bold text-red-600">
                          {formatCurrency(amount)}
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