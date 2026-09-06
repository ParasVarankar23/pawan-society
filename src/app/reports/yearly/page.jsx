"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  IndianRupee,
  RefreshCw,
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

export default function YearlyReportPage() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(String(currentYear));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      const response = await api.get(
        `/reports/yearly?year=${encodeURIComponent(year)}`
      );

      setData(response?.data || {});
    } catch (error) {
      setData(null);

      showToast(
        error?.message || "Failed to load yearly report.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [year]);

  const months = useMemo(
    () =>
      data?.monthly ||
      data?.months ||
      data?.items ||
      [],
    [data]
  );

  const income = Number(
    data?.income ??
      data?.totalIncome ??
      0
  );

  const expense = Number(
    data?.expense ??
      data?.totalExpense ??
      0
  );

  const balance = Number(
    data?.balance ??
      data?.closingBalance ??
      income - expense
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <BarChart3 size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Reports
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Yearly Report
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Annual financial summary and monthly performance.
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
          <div className="relative max-w-xs">
            <Calendar
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Income
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(income)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Expenses
            </p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(expense)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Closing Balance
            </p>
            <p
              className={`mt-2 text-2xl font-bold ${
                balance >= 0
                  ? "text-indigo-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Monthly Performance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Month</th>
                  <th className="px-5 py-4 text-right">Income</th>
                  <th className="px-5 py-4 text-right">Expense</th>
                  <th className="px-5 py-4 text-right">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {months.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-16 text-center"
                    >
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-4 font-semibold text-slate-700">
                        No yearly data found
                      </p>
                    </td>
                  </tr>
                ) : (
                  months.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.month ||
                          item.billingMonth ||
                          "-"}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                        {formatCurrency(
                          item.income || 0
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-red-600">
                        {formatCurrency(
                          item.expense || 0
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-slate-800">
                        {formatCurrency(
                          item.balance || 0
                        )}
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