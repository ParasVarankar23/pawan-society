"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

function money(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    { maximumFractionDigits: 2 }
  )}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function formatMonth(value) {
  if (!value) return "-";

  return new Date(`${value}-01T00:00:00`).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
}

function getTotal(bill) {
  return bill.totalOutstanding ?? bill.subtotal ?? 0;
}

function getRoom(bill) {
  return bill.roomId?.roomNumber || bill.roomNumber || "-";
}

function getMember(bill) {
  return bill.memberId?.name || bill.memberName || "-";
}

function statusClass(status) {
  if (status === "PAID") return "bg-emerald-50 text-emerald-700";
  if (status === "OVERDUE") return "bg-red-50 text-red-700";
  if (status === "PARTIAL") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export default function BillingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadBill() {
      try {
        const result = await api.get(`/billing/${id}`);
        setBill(result.data);
      } catch (err) {
        setError(err.message || "Unable to load bill.");
      } finally {
        setLoading(false);
      }
    }

    loadBill();
  }, [id]);

  const charges = bill?.currentCharges || {};
  const rows = [
    ["Previous Outstanding", bill?.previousOutstanding],
    ["Maintenance", charges.maintenance],
    ["Sinking Fund", charges.sinkingFund],
    ["Insurance", charges.insurance],
    ["Education Fund", charges.educationFund],
    ["Parking", charges.parking],
    ["Water", charges.water],
    ["Other Charges", charges.other],
    ["Penalty", bill?.penalty?.amount],
  ];

  return (
    <AppShell>
      <Toast
        message={error}
        onClose={() => setError("")}
      />

      {loading ? (
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      ) : !bill ? (
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Bill not found</h1>
          <Link
            href="/billing"
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            Back to Billing
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-semibold text-slate-500 hover:text-slate-950"
              >
                ← Back to Billing
              </button>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Billing Details
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Bill #{bill.billNumber || "-"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {formatMonth(bill.billingMonth)} · Room {getRoom(bill)} · {getMember(bill)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`/api/billing/${bill._id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Download PDF
              </a>
              <Link
                href={`/payments/add?roomId=${bill.roomId?._id || bill.roomId}`}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Record Payment
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Room</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{getRoom(bill)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Member</p>
              <p className="mt-1 truncate text-lg font-bold text-slate-900">{getMember(bill)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500">Status</p>
              <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(bill.status)}`}>
                {bill.status || "GENERATED"}
              </span>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Bill Summary</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{money(value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-slate-950 px-5 py-4">
                <span className="font-bold text-white">Total</span>
                <span className="text-xl font-bold text-white">{money(getTotal(bill))}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-500">Paid Amount</span>
                <span className="font-bold text-emerald-600">{money(bill.paidAmount)}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-bold text-slate-900">Balance Due</span>
                <span className="text-xl font-bold text-orange-600">{money(bill.balanceAmount)}</span>
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">Bill date</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(bill.billDate)}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">Due date</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(bill.dueDate)}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs text-slate-500">Remarks</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{bill.remarks || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}