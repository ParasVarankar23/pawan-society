"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Droplets,
  IndianRupee,
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

export default function DrinkingWaterPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

      const params = new URLSearchParams();

      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const query = params.toString();

      const response = await api.get(
        `/drinking-water${query ? `?${query}` : ""}`
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
        error?.message || "Failed to load drinking water bills.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [fromDate, toDate]);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bills;

    return bills.filter((bill) =>
      [
        bill.supplierName,
        bill.billNumber,
        bill.unit,
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

  const totalQuantity = filteredBills.reduce(
    (sum, bill) => sum + Number(bill.quantity || 0),
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              <Droplets size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Society Expenses
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Drinking Water
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage drinking water supplier bills and payments
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
            <p className="text-sm text-slate-500">Total Quantity</p>
            <p className="mt-2 text-2xl font-bold text-cyan-600">
              {totalQuantity}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totalAmount)}
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
                placeholder="Search supplier, bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Drinking Water Register
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Supplier</th>
                  <th className="px-5 py-4">Bill No.</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Rate</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 7 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No drinking water bills found
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

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {bill.supplierName || "-"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-indigo-600">
                        {bill.billNumber || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.quantity || 0} {bill.unit || ""}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatCurrency(bill.rate || 0)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-600">
                        {formatCurrency(bill.amount || 0)}
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