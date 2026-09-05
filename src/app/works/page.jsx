"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  Lightbulb,
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

export default function ElectricityPage() {
  const [bills, setBills] = useState([]);
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

  async function loadBills() {
    try {
      setRefreshing(true);

      const query = billingMonth
        ? `?billingMonth=${encodeURIComponent(billingMonth)}`
        : "";

      const response = await api.get(
        `/electricity${query}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
          response?.data?.bills ||
          [];

      setBills(data);
    } catch (error) {
      setBills([]);

      showToast(
        error?.message || "Failed to load electricity bills.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [billingMonth]);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bills;

    return bills.filter((bill) =>
      [
        bill.billNumber,
        bill.billingMonth,
        bill.referenceNumber,
        bill.paymentMode,
        bill.remarks,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [bills, search]);

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Lightbulb size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Society Expenses
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Electricity
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage society electricity bills and payments
              </p>
            </div>
          </div>

          <button
            onClick={loadBills}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Bills</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredBills.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
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
                placeholder="Search bill number, reference..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="month"
                value={billingMonth}
                onChange={(e) =>
                  setBillingMonth(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Electricity Register
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Bill Date</th>
                  <th className="px-5 py-4">Bill No.</th>
                  <th className="px-5 py-4">Month</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-right">Paid</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 8 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No electricity bills found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(bill.billDate)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-indigo-600">
                        {bill.billNumber || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.billingMonth || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(bill.dueDate)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-slate-800">
                        {formatCurrency(bill.amount)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                        {formatCurrency(bill.paidAmount)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {bill.status || "UNPAID"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.paymentMode || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}