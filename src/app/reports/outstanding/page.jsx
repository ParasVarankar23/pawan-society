"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  Search,
  Users,
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

export default function OutstandingReportPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [billingMonth, setBillingMonth] = useState("");

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

            <input
              type="month"
              value={billingMonth}
              onChange={(e) =>
                setBillingMonth(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
            />
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