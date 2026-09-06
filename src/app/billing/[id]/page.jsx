"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Droplets, Settings2, Trash2 } from "lucide-react";

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
  const [chargeSettings, setChargeSettings] = useState(null);
  const [waterReading, setWaterReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadBill() {
      try {
        const result = await api.get(`/billing/${id}`);
        const loadedBill = result.data;
        setBill(loadedBill);

        const roomId = loadedBill.roomId?._id || loadedBill.roomId;
        const month = loadedBill.billingMonth;
        const [chargesResult, waterResult] = await Promise.all([
          api.get("/charges"),
          roomId && month
            ? api.get(
                `/water/readings?roomId=${encodeURIComponent(
                  roomId
                )}&billingMonth=${encodeURIComponent(month)}`
              )
            : Promise.resolve({ data: [] }),
        ]);

        setChargeSettings(
          chargesResult.data?.charge ||
            chargesResult.data?.item ||
            chargesResult.data ||
            null
        );

        const readings = Array.isArray(waterResult.data)
          ? waterResult.data
          : waterResult.data?.readings || [];
        setWaterReading(readings[0] || null);
      } catch (err) {
        setError(err.message || "Unable to load bill.");
      } finally {
        setLoading(false);
      }
    }

    loadBill();
  }, [id]);

  async function handleDelete() {
    if (!bill || !window.confirm(`Delete bill #${bill.billNumber}?`)) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/billing/${id}`);
      router.push("/billing");
    } catch (err) {
      setError(err.message || "Unable to delete bill.");
      setDeleting(false);
    }
  }

  const storedCharges = bill?.currentCharges || {};
  const storedChargesTotal = [
    storedCharges.maintenance,
    storedCharges.sinkingFund,
    storedCharges.insurance,
    storedCharges.educationFund,
    storedCharges.parking,
    storedCharges.nonOccupancy,
    storedCharges.rentNoc,
    storedCharges.water,
    storedCharges.other,
  ].reduce((total, value) => total + Number(value || 0), 0);

  const charges = storedChargesTotal > 0
    ? storedCharges
    : {
        maintenance: chargeSettings?.maintenance,
        sinkingFund: chargeSettings?.sinkingFund,
        insurance: chargeSettings?.insurance,
        educationFund: chargeSettings?.educationFund,
        parking: chargeSettings?.parking,
        nonOccupancy: chargeSettings?.nonOccupancy,
        rentNoc: chargeSettings?.rentNoc,
        water: waterReading?.amount,
        other: chargeSettings?.other,
      };

  const currentChargesTotal = [
    charges.maintenance,
    charges.sinkingFund,
    charges.insurance,
    charges.educationFund,
    charges.parking,
    charges.nonOccupancy,
    charges.rentNoc,
    charges.water,
    charges.other,
  ].reduce((total, value) => total + Number(value || 0), 0);

  const rows = [
    ["Previous Outstanding", bill?.previousOutstanding],
    ["Maintenance", charges.maintenance],
    ["Sinking Fund", charges.sinkingFund],
    ["Insurance", charges.insurance],
    ["Education Fund", charges.educationFund],
    ["Parking", charges.parking],
    ["Non-Occupancy", charges.nonOccupancy],
    ["Rent NOC", charges.rentNoc],
    ["Water", charges.water],
    ["Other Charges", charges.other],
    ["Penalty", bill?.penalty?.amount],
  ];

  function downloadBillPdf() {
    if (!bill) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 2200;

    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#0f172a";
    context.font = "bold 54px Arial";
    context.fillText("Pawan Society", 110, 130);

    context.fillStyle = "#64748b";
    context.font = "28px Arial";
    context.fillText("Maintenance Bill", 110, 180);
    context.fillText(`Bill #${bill.billNumber || "-"}`, 1100, 130);
    context.fillText(formatMonth(bill.billingMonth), 1100, 180);

    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(110, 230);
    context.lineTo(1490, 230);
    context.stroke();

    context.fillStyle = "#334155";
    context.font = "bold 30px Arial";
    context.fillText(`Room: ${getRoom(bill)}`, 110, 300);
    context.font = "30px Arial";
    context.fillText(`Member: ${getMember(bill)}`, 110, 350);

    let y = 460;
    context.font = "30px Arial";
    rows.forEach(([label, value]) => {
      context.fillStyle = "#64748b";
      context.fillText(label, 110, y);
      context.fillStyle = "#0f172a";
      context.textAlign = "right";
      context.fillText(money(value), 1490, y);
      context.textAlign = "left";
      y += 70;
    });

    context.fillStyle = "#f1f5f9";
    context.fillRect(70, y - 45, 1460, 100);
    context.fillStyle = "#334155";
    context.font = "bold 32px Arial";
    context.fillText("Current Charges Total", 110, y + 15);
    context.textAlign = "right";
    context.fillText(money(currentChargesTotal), 1490, y + 15);
    context.textAlign = "left";
    y += 150;

    context.fillStyle = "#020617";
    context.fillRect(70, y - 55, 1460, 125);
    context.fillStyle = "#ffffff";
    context.font = "bold 38px Arial";
    context.fillText("Total", 110, y + 20);
    context.textAlign = "right";
    context.fillText(money(getTotal(bill)), 1490, y + 20);
    context.textAlign = "left";

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Unable to create the bill download.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bill-${bill.billNumber || "download"}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

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
              <button
                type="button"
                onClick={downloadBillPdf}
                className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Download Bill
              </button>
              <Link
                href={`/payments/add?roomId=${bill.roomId?._id || bill.roomId}`}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Record Payment
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete Bill"}
              </button>
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
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3 text-sm">
                <span className="font-semibold text-slate-600">Current Charges Total</span>
                <span className="font-bold text-slate-900">{money(currentChargesTotal)}</span>
              </div>
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

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-indigo-600" />
                <h2 className="font-bold text-slate-900">Charge settings used</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Maintenance", chargeSettings?.maintenance],
                  ["Sinking Fund", chargeSettings?.sinkingFund],
                  ["Insurance", chargeSettings?.insurance],
                  ["Education Fund", chargeSettings?.educationFund],
                  ["Parking", chargeSettings?.parking],
                  ["Water / Unit", chargeSettings?.waterRatePerUnit],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-800">{money(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Droplets size={18} className="text-cyan-600" />
                <h2 className="font-bold text-slate-900">Water reading used</h2>
              </div>
              {waterReading ? (
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Previous reading</p>
                    <p className="mt-1 font-semibold text-slate-800">{waterReading.previousReading ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Current reading</p>
                    <p className="mt-1 font-semibold text-slate-800">{waterReading.currentReading ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Units</p>
                    <p className="mt-1 font-semibold text-slate-800">{waterReading.units ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Water amount</p>
                    <p className="mt-1 font-semibold text-slate-800">{money(waterReading.amount)}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No water reading was recorded for this room and billing month.
                </p>
              )}
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