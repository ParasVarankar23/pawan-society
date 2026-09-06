"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Mail, ReceiptText, UserRound } from "lucide-react";
import { useParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
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

function formatMode(value) {
  return value
    ? value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}

export default function ReceiptDetailsPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadReceipt() {
      try {
        const response = await api.get(`/receipts/${id}`);
        setReceipt(response.data);
      } catch (requestError) {
        setError(requestError.message || "Unable to load receipt.");
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [id]);

  function downloadReceipt() {
    if (!receipt) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1000;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0f172a";
    context.font = "bold 48px Arial";
    context.fillText("Pawan Society", 90, 100);
    context.font = "28px Arial";
    context.fillStyle = "#64748b";
    context.fillText("Payment Receipt", 90, 145);
    context.fillText(`Receipt #${receipt.receiptNumber || "-"}`, 1000, 100);
    context.fillText(formatDate(receipt.receiptDate), 1000, 145);

    context.strokeStyle = "#cbd5e1";
    context.beginPath();
    context.moveTo(90, 190);
    context.lineTo(1310, 190);
    context.stroke();

    context.fillStyle = "#334155";
    context.font = "bold 30px Arial";
    context.fillText(`Member: ${receipt.memberId?.name || "-"}`, 90, 270);
    context.font = "30px Arial";
    context.fillText(`Room: ${receipt.roomId?.roomNumber || "-"}`, 90, 325);
    context.fillText(`Payment mode: ${formatMode(receipt.paymentMode)}`, 90, 380);

    context.fillStyle = "#020617";
    context.fillRect(70, 500, 1260, 150);
    context.fillStyle = "#ffffff";
    context.font = "bold 42px Arial";
    context.fillText("Amount Received", 110, 590);
    context.textAlign = "right";
    context.fillText(money(receipt.amount), 1290, 590);
    context.textAlign = "left";

    context.fillStyle = "#64748b";
    context.font = "24px Arial";
    context.fillText("This receipt confirms the payment recorded by Pawan Society Management.", 90, 760);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Unable to create the receipt download.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${receipt.receiptNumber || "download"}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/receipts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
          <ArrowLeft size={16} />
          Back to Receipts
        </Link>

        {loading && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">Loading receipt...</div>}
        {!loading && error && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
        {!loading && !error && receipt && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white"><ReceiptText size={23} /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Payment Receipt</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Receipt #{receipt.receiptNumber}</h1>
                  <p className="mt-1 text-sm text-slate-500">{receipt.memberId?.name || "-"} · Room {receipt.roomId?.roomNumber || "-"}</p>
                </div>
              </div>
              <button type="button" onClick={downloadReceipt} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                <Download size={16} />
                Download Receipt
              </button>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">Receipt Summary</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Payment Recorded</span>
              </div>
              <div className="p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Member" value={receipt.memberId?.name} />
                  <Detail label="Room" value={receipt.roomId?.roomNumber} />
                  <Detail label="Receipt date" value={formatDate(receipt.receiptDate)} />
                  <Detail label="Payment mode" value={formatMode(receipt.paymentMode)} />
                  <Detail label="Email status" value={receipt.emailStatus} />
                  <Detail label="Payment reference" value={receipt.paymentId?._id} />
                </div>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-5">
                  <span className="font-bold text-white">Amount Received</span>
                  <span className="text-2xl font-bold text-white">{money(receipt.amount)}</span>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><UserRound size={18} className="text-slate-500" /><h2 className="font-bold text-slate-900">Member</h2></div><p className="mt-3 text-sm text-slate-600">{receipt.memberId?.email || "No email available"}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Mail size={18} className="text-slate-500" /><h2 className="font-bold text-slate-900">Email delivery</h2></div><p className="mt-3 text-sm text-slate-600">{receipt.emailStatus || "NOT_SENT"}</p></div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
