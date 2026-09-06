"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

/* =========================================================
   ICONS
========================================================= */

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

function SearchSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IndianRupeeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M6 5h12" />
      <path d="M6 9h9" />
      <path d="M8 5c4 0 6 2 6 5s-2 5-6 5h-2l8 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M18 14.5c1.8.8 3 2.7 3 5" />
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

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M6 3h9l4 4v14H6V3Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
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

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function getCurrentMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getPreviousMonth(month) {
  const [year, monthNumber] =
    month.split("-").map(Number);

  const date = new Date(
    year,
    monthNumber - 2,
    1
  );

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getNextMonth(month) {
  const [year, monthNumber] =
    month.split("-").map(Number);

  const date = new Date(
    year,
    monthNumber,
    1
  );

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatMonth(month) {
  if (!month) return "";

  const [year, monthNumber] =
    month.split("-").map(Number);

  const date = new Date(
    year,
    monthNumber - 1,
    1
  );

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
}

function normalizeBills(result) {
  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (
    Array.isArray(result?.data?.bills)
  ) {
    return result.data.bills;
  }

  if (Array.isArray(result?.bills)) {
    return result.bills;
  }

  return [];
}

function getRoomNumber(bill) {
  return (
    bill.roomNumber ||
    bill.room?.roomNumber ||
    bill.roomId?.roomNumber ||
    "-"
  );
}

function getMemberName(bill) {
  return (
    bill.memberName ||
    bill.member?.name ||
    bill.memberId?.name ||
    "Member not assigned"
  );
}

function getBillTotal(bill) {
  if (
    bill.totalAmount !== undefined &&
    bill.totalAmount !== null
  ) {
    return Number(bill.totalAmount || 0);
  }

  if (
    bill.totalOutstanding !== undefined &&
    bill.totalOutstanding !== null
  ) {
    return Number(
      bill.totalOutstanding || 0
    );
  }

  return Number(bill.subtotal || 0);
}

function getBillBalance(bill) {
  if (
    bill.balanceAmount !== undefined &&
    bill.balanceAmount !== null
  ) {
    return Number(
      bill.balanceAmount || 0
    );
  }

  return Math.max(
    getBillTotal(bill) - Number(bill.paidAmount || 0),
    0
  );
}

function getBillCurrentCharges(bill) {
  const charges = bill.currentCharges || {};
  const storedTotal = [
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

  if (storedTotal > 0) return storedTotal;

  return Math.max(
    getBillTotal(bill) -
      Number(bill.previousOutstanding || 0) -
      Number(bill.penalty?.amount || 0),
    0
  );
}

async function downloadBillCanvas(bill) {
  let charges = bill.currentCharges || {};
  const storedTotal = [
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

  if (storedTotal === 0) {
    try {
      const roomId = bill.roomId?._id || bill.roomId;
      const [chargesResult, waterResult] = await Promise.all([
        api.get("/charges"),
        roomId && bill.billingMonth
          ? api.get(
              `/water/readings?roomId=${encodeURIComponent(
                roomId
              )}&billingMonth=${encodeURIComponent(
                bill.billingMonth
              )}`
            )
          : Promise.resolve({ data: [] }),
      ]);
      const settings =
        chargesResult.data?.charge ||
        chargesResult.data?.item ||
        chargesResult.data ||
        {};
      const readings = Array.isArray(waterResult.data)
        ? waterResult.data
        : waterResult.data?.readings || [];

      charges = {
        maintenance: settings.maintenance,
        sinkingFund: settings.sinkingFund,
        insurance: settings.insurance,
        educationFund: settings.educationFund,
        parking: settings.parking,
        nonOccupancy: settings.nonOccupancy,
        rentNoc: settings.rentNoc,
        water: readings[0]?.amount || 0,
        other: settings.other,
      };
    } catch {
      charges = bill.currentCharges || {};
    }
  }

  const rows = [
    ["Previous Outstanding", bill.previousOutstanding],
    ["Maintenance", charges.maintenance],
    ["Sinking Fund", charges.sinkingFund],
    ["Insurance", charges.insurance],
    ["Education Fund", charges.educationFund],
    ["Parking", charges.parking],
    ["Non-Occupancy", charges.nonOccupancy],
    ["Rent NOC", charges.rentNoc],
    ["Water", charges.water],
    ["Other Charges", charges.other],
    ["Penalty", bill.penalty?.amount],
  ];
  const currentTotal = [
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

  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1800;

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0f172a";
  context.font = "bold 48px Arial";
  context.fillText("Pawan Society", 90, 100);
  context.font = "28px Arial";
  context.fillStyle = "#64748b";
  context.fillText("Maintenance Bill", 90, 145);
  context.fillText(`Bill #${bill.billNumber || "-"}`, 1000, 100);
  context.fillText(formatMonth(bill.billingMonth), 1000, 145);

  context.strokeStyle = "#cbd5e1";
  context.beginPath();
  context.moveTo(90, 190);
  context.lineTo(1310, 190);
  context.stroke();

  context.fillStyle = "#334155";
  context.font = "bold 30px Arial";
  context.fillText(`Member: ${getMemberName(bill)}`, 90, 270);
  context.font = "30px Arial";
  context.fillText(`Room: ${getRoomNumber(bill)}`, 90, 325);

  let y = 460;
  context.font = "26px Arial";
  rows.forEach(([label, value]) => {
    context.fillStyle = "#64748b";
    context.fillText(label, 90, y);
    context.fillStyle = "#0f172a";
    context.textAlign = "right";
    context.fillText(money(value), 1310, y);
    context.textAlign = "left";
    y += 62;
  });

  context.fillStyle = "#f1f5f9";
  context.fillRect(70, y - 40, 1260, 90);
  context.fillStyle = "#334155";
  context.font = "bold 28px Arial";
  context.fillText("Current Charges Total", 90, y + 15);
  context.textAlign = "right";
  context.fillText(money(currentTotal), 1310, y + 15);
  context.textAlign = "left";
  y += 140;

  context.fillStyle = "#020617";
  context.fillRect(70, y - 50, 1260, 120);
  context.fillStyle = "#ffffff";
  context.font = "bold 36px Arial";
  context.fillText("Total", 110, y + 20);
  context.textAlign = "right";
  context.fillText(money(getBillTotal(bill)), 1290, y + 20);
  context.textAlign = "left";

  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bill-${bill.billNumber || "download"}.png`;
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/* =========================================================
   STATUS
========================================================= */

const statusConfig = {
  PAID: {
    label: "Paid",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckIcon,
  },

  PARTIAL: {
    label: "Partial",
    className:
      "bg-amber-50 text-amber-700 border-amber-100",
    icon: AlertIcon,
  },

  UNPAID: {
    label: "Unpaid",
    className:
      "bg-orange-50 text-orange-700 border-orange-100",
    icon: AlertIcon,
  },

  OVERDUE: {
    label: "Overdue",
    className:
      "bg-red-50 text-red-700 border-red-100",
    icon: AlertIcon,
  },

  DRAFT: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-600 border-slate-200",
    icon: FileIcon,
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 border-red-100",
    icon: CloseIcon,
  },
};

function StatusBadge({ status }) {
  const config =
    statusConfig[status] ||
    statusConfig.UNPAID;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
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

    emerald:
      "bg-emerald-50 text-emerald-600",

    blue:
      "bg-blue-50 text-blue-600",

    orange:
      "bg-orange-50 text-orange-600",

    violet:
      "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            styles[type]
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MOBILE BILL CARD
========================================================= */

function BillCard({
  bill,
  onDetails,
}) {
  const total = getBillTotal(bill);
  const paid = Number(
    bill.paidAmount || 0
  );
  const balance =
    getBillBalance(bill);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <Link
            href={`/billing/${bill._id}`}
            className="text-sm font-bold text-slate-950 hover:underline"
          >
            Bill #{bill.billNumber || "-"}
          </Link>

          <p className="mt-1 text-xs text-slate-500">
            {getMemberName(bill)}
          </p>

        </div>

        <StatusBadge
          status={bill.status}
        />

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] text-slate-400">
            Room
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {getRoomNumber(bill)}
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[10px] text-slate-400">
            Bill Date
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {formatDate(
              bill.billDate
            )}
          </p>

        </div>

      </div>

      <div className="mt-3 rounded-xl bg-slate-950 p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {money(total)}
            </p>
          </div>

          <div className="text-right">

            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Balance
            </p>

            <p className="mt-1 text-lg font-bold text-orange-300">
              {money(balance)}
            </p>

          </div>

        </div>

      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">

        <div className="rounded-xl bg-emerald-50 p-3">

          <p className="text-[10px] text-emerald-600">
            Paid
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-700">
            {money(paid)}
          </p>

        </div>

        <div className="rounded-xl bg-orange-50 p-3">

          <p className="text-[10px] text-orange-600">
            Previous
          </p>

          <p className="mt-1 text-sm font-bold text-orange-700">
            {money(
              bill.previousOutstanding
            )}
          </p>

        </div>

      </div>

      <div className="mt-4 flex gap-2">

        <Link
          href={`/billing/${bill._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <EyeIcon />
          View
        </Link>

        <button
          type="button"
          onClick={() => downloadBillCanvas(bill)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <DownloadIcon />
          Download
        </button>

        <button
          type="button"
          onClick={() =>
            onDetails(bill)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <MoreIcon />
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function BillingPage() {
  const router = useRouter();

  const [bills, setBills] =
    useState([]);

  const [billingMonth, setBillingMonth] =
    useState(getCurrentMonth);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedBill, setSelectedBill] =
    useState(null);

  /* =======================================================
     LOAD BILLS
  ======================================================= */

  async function loadBills() {
    setLoading(true);
    setError("");

    try {
      const query =
        new URLSearchParams();

      query.set(
        "billingMonth",
        billingMonth
      );

      if (status !== "ALL") {
        query.set(
          "status",
          status
        );
      }

      const result =
        await api.get(
          `/billing?${query.toString()}`
        );

      setBills(
        normalizeBills(result)
      );
    } catch (err) {
      console.error(
        "Billing load error:",
        err
      );

      setError(
        err.message ||
          "Unable to load billing data."
      );

      setBills([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [billingMonth, status]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredBills =
    useMemo(() => {
      if (!search.trim()) {
        return bills;
      }

      const query =
        search
          .trim()
          .toLowerCase();

      return bills.filter(
        (bill) => {
          const billNumber =
            String(
              bill.billNumber || ""
            );

          const room =
            String(
              getRoomNumber(bill)
            );

          const member =
            String(
              getMemberName(bill)
            );

          return (
            billNumber
              .toLowerCase()
              .includes(query) ||
            room
              .toLowerCase()
              .includes(query) ||
            member
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [bills, search]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      let totalBilled = 0;
      let totalCollected = 0;
      let totalOutstanding = 0;

      let paidCount = 0;
      let unpaidCount = 0;
      let partialCount = 0;

      bills.forEach((bill) => {
        const total =
          getBillTotal(bill);

        const paid =
          Number(
            bill.paidAmount || 0
          );

        const balance =
          getBillBalance(bill);

        totalBilled += total;
        totalCollected += paid;
        totalOutstanding += balance;

        if (
          bill.status === "PAID"
        ) {
          paidCount++;
        }

        if (
          bill.status === "PARTIAL"
        ) {
          partialCount++;
        }

        if (
          bill.status === "UNPAID" ||
          bill.status === "OVERDUE"
        ) {
          unpaidCount++;
        }
      });

      const collectionRate =
        totalBilled > 0
          ? (totalCollected /
              totalBilled) *
            100
          : 0;

      return {
        totalBills:
          bills.length,

        totalBilled,

        totalCollected,

        totalOutstanding,

        paidCount,

        unpaidCount,

        partialCount,

        collectionRate,
      };
    }, [bills]);

  /* =======================================================
     MONTH CHANGE
  ======================================================= */

  function changeMonth(direction) {
    setBillingMonth(
      (currentMonth) =>
        direction === "previous"
          ? getPreviousMonth(
              currentMonth
            )
          : getNextMonth(
              currentMonth
            )
    );
  }

  /* =======================================================
     GENERATE
  ======================================================= */

  function generateMonthlyBills() {
    router.push(
      `/billing/generate?month=${encodeURIComponent(
        billingMonth
      )}`
    );
  }

  /* =======================================================
     CLEAR FILTER
  ======================================================= */

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
  }

  async function openBillDetails(bill) {
    try {
      const roomId = bill.roomId?._id || bill.roomId;
      const month = bill.billingMonth;
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

      const chargeSettings =
        chargesResult.data?.charge ||
        chargesResult.data?.item ||
        chargesResult.data ||
        {};
      const readings = Array.isArray(waterResult.data)
        ? waterResult.data
        : waterResult.data?.readings || [];
      const waterAmount = readings[0]?.amount || 0;
      const storedCharges = bill.currentCharges || {};
      const storedTotal = [
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

      setSelectedBill({
        ...bill,
        currentCharges: storedTotal > 0
          ? storedCharges
          : {
              maintenance: chargeSettings.maintenance,
              sinkingFund: chargeSettings.sinkingFund,
              insurance: chargeSettings.insurance,
              educationFund: chargeSettings.educationFund,
              parking: chargeSettings.parking,
              nonOccupancy: chargeSettings.nonOccupancy,
              rentNoc: chargeSettings.rentNoc,
              water: waterAmount,
              other: chargeSettings.other,
            },
      });
    } catch {
      setSelectedBill(bill);
    }
  }

  return (
    <AppShell>

      <Toast
        message={error}
        onClose={() =>
          setError("")
        }
      />

      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Finance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Billing
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage monthly maintenance bills,
              outstanding amounts, penalties,
              water charges and collections.
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={loadBills}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              Refresh
            </button>

            <Link
              href={`/billing/generate?month=${billingMonth}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <PlusIcon />
              Generate Bill
            </Link>

            <button
              type="button"
              onClick={
                generateMonthlyBills
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <BillIcon />
              Generate Monthly Bills
            </button>

          </div>

        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">

          <StatCard
            title="Total Bills"
            value={
              summary.totalBills
            }
            subtitle={formatMonth(
              billingMonth
            )}
            icon={
              <BillIcon />
            }
          />

          <StatCard
            title="Total Billed"
            value={money(
              summary.totalBilled
            )}
            subtitle="Current billing"
            type="blue"
            icon={
              <IndianRupeeIcon />
            }
          />

          <StatCard
            title="Collected"
            value={money(
              summary.totalCollected
            )}
            subtitle={`${summary.paidCount} paid`}
            type="emerald"
            icon={
              <CheckIcon />
            }
          />

          <StatCard
            title="Outstanding"
            value={money(
              summary.totalOutstanding
            )}
            subtitle={`${summary.unpaidCount} unpaid`}
            type="orange"
            icon={
              <AlertIcon />
            }
          />

          <StatCard
            title="Partial"
            value={
              summary.partialCount
            }
            subtitle="Partially paid"
            type="violet"
            icon={
              <BillIcon />
            }
          />

          <StatCard
            title="Collection Rate"
            value={`${summary.collectionRate.toFixed(
              1
            )}%`}
            subtitle="Collected / billed"
            type="blue"
            icon={
              <UsersIcon />
            }
          />

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            {/* MONTH */}

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  changeMonth(
                    "previous"
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <ChevronLeftIcon />
              </button>

              <div className="relative">

                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <CalendarIcon />
                </div>

                <input
                  type="month"
                  value={
                    billingMonth
                  }
                  onChange={(
                    event
                  ) =>
                    setBillingMonth(
                      event.target
                        .value
                    )
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  changeMonth(
                    "next"
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <ChevronRightIcon />
              </button>

              <span className="hidden text-sm font-semibold text-slate-600 sm:block">
                {formatMonth(
                  billingMonth
                )}
              </span>

            </div>

            {/* SEARCH + STATUS */}

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative sm:min-w-[300px]">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon />
                </div>

                <input
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search bill, room or member..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />

              </div>

              <select
                value={status}
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.target
                      .value
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-40"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PARTIAL">
                  Partial
                </option>

                <option value="UNPAID">
                  Unpaid
                </option>

                <option value="OVERDUE">
                  Overdue
                </option>

                <option value="DRAFT">
                  Draft
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            BILL REGISTER
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Monthly Bill Register
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredBills.length} of{" "}
                {bills.length} bills
                displayed
              </p>

            </div>

            {(search ||
              status !== "ALL") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:underline"
              >
                Clear Filters
              </button>
            )}

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="space-y-3 p-5">

              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}

            </div>
          ) : filteredBills.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <BillIcon />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                No bills found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {search ||
                status !== "ALL"
                  ? "Try changing your search or status filter."
                  : `No bills are available for ${formatMonth(
                      billingMonth
                    )}.`}
              </p>

              {search ||
              status !== "ALL" ? (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    generateMonthlyBills
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <PlusIcon />
                  Generate Bills
                </button>
              )}

            </div>
          ) : (
            <>
              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="space-y-3 bg-slate-50 p-4 lg:hidden">

                {filteredBills.map(
                  (bill) => (
                    <BillCard
                      key={
                        bill._id ||
                        bill.id ||
                        bill.billNumber
                      }
                      bill={bill}
                      onDetails={
                        openBillDetails
                      }
                    />
                  )
                )}

              </div>

              {/* =================================================
                  DESKTOP
              ================================================= */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1200px] text-sm">

                  <thead className="bg-slate-50/70">

                    <tr className="border-b border-slate-100">

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Bill
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Room
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Member
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Previous
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Current
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Paid
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Balance
                      </th>

                      <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBills.map(
                      (bill) => {
                        const total =
                          getBillTotal(
                            bill
                          );

                        const paid =
                          Number(
                            bill.paidAmount ||
                              0
                          );

                        const balance =
                          getBillBalance(
                            bill
                          );

                        return (
                          <tr
                            key={
                              bill._id ||
                              bill.id ||
                              bill.billNumber
                            }
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                          >

                            <td className="px-5 py-4">

                              <Link
                                href={`/billing/${bill._id}`}
                                className="font-bold text-slate-900 hover:underline"
                              >
                                #
                                {bill.billNumber ||
                                  "-"}
                              </Link>

                              <p className="mt-1 text-[11px] text-slate-400">
                                {formatMonth(
                                  bill.billingMonth ||
                                    billingMonth
                                )}
                              </p>

                            </td>

                            <td className="px-5 py-4">

                              <span className="font-semibold text-slate-800">
                                {getRoomNumber(
                                  bill
                                )}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <span className="font-semibold text-slate-700">
                                {getMemberName(
                                  bill
                                )}
                              </span>

                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(
                                bill.billDate
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-slate-600">
                              {money(
                                bill.previousOutstanding
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-slate-800">
                              {money(
                                total
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                              {money(
                                paid
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-slate-950">
                              {money(
                                balance
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">

                              <StatusBadge
                                status={
                                  bill.status
                                }
                              />

                            </td>

                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-1">

                                <Link
                                  href={`/billing/${bill._id}`}
                                  title="View bill"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                                >
                                  <EyeIcon />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => downloadBillCanvas(bill)}
                                  title="Download PDF"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                                >
                                  <DownloadIcon />
                                </button>

                                <button
                                  type="button"
                                  title="More details"
                                  onClick={() =>
                                    openBillDetails(
                                      bill
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                                >
                                  <MoreIcon />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            </>
          )}

        </div>

      </div>

      {/* =====================================================
          BILL DETAILS MODAL
      ===================================================== */}

      {selectedBill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedBill(
                null
              );
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Billing Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  Bill #
                  {
                    selectedBill.billNumber ||
                    "-"
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBill(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <CloseIcon />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="space-y-5 p-5">

              {/* MEMBER */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] text-slate-400">
                    Room
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {getRoomNumber(
                      selectedBill
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] text-slate-400">
                    Member
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-900">
                    {getMemberName(
                      selectedBill
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] text-slate-400">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={
                        selectedBill.status
                      }
                    />
                  </div>

                </div>

              </div>

              {/* CHARGES */}

              <div className="overflow-hidden rounded-2xl border border-slate-200">

                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">

                  <h3 className="text-sm font-bold text-slate-800">
                    Bill Summary
                  </h3>

                </div>

                <div className="divide-y divide-slate-100">

                  <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-600">
                      Current Charges Total
                    </span>

                    <span className="font-bold text-slate-900">
                      {money(
                        getBillCurrentCharges(
                          selectedBill
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Previous Outstanding
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill.previousOutstanding
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Maintenance
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.maintenance
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Sinking Fund
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.sinkingFund
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Insurance
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.insurance
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Education Fund
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.educationFund
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Parking
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.parking
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Water
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.water
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Other Charges
                    </span>

                    <span className="font-semibold text-slate-800">
                      {money(
                        selectedBill
                          .currentCharges
                          ?.other
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Penalty
                    </span>

                    <span className="font-semibold text-red-600">
                      {money(
                        selectedBill
                          .penalty
                          ?.amount
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between bg-slate-950 px-4 py-4">

                    <span className="font-bold text-white">
                      Total
                    </span>

                    <span className="text-xl font-bold text-white">
                      {money(
                        getBillTotal(
                          selectedBill
                        )
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-sm">

                    <span className="text-slate-500">
                      Paid Amount
                    </span>

                    <span className="font-bold text-emerald-600">
                      {money(
                        selectedBill.paidAmount
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between px-4 py-4">

                    <span className="font-bold text-slate-900">
                      Balance Due
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      {money(
                        getBillBalance(
                          selectedBill
                        )
                      )}
                    </span>

                  </div>

                </div>

              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] text-slate-400">
                    Bill Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(
                      selectedBill.billDate
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-[10px] text-slate-400">
                    Due Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(
                      selectedBill.dueDate
                    )}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap justify-end gap-2">

                <Link
                  href={`/billing/${selectedBill._id}`}
                  onClick={() =>
                    setSelectedBill(
                      null
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <EyeIcon />
                  Open Bill
                </Link>

                <button
                  type="button"
                  onClick={() => downloadBillCanvas(selectedBill)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <DownloadIcon />
                  Download Bill
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </AppShell>
  );
}