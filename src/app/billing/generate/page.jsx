"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

function currentMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function defaultDueDate(month) {
  return `${month}-10`;
}

function formatMonth(month) {
  if (!month) return "";

  return new Date(`${month}-01T00:00:00`).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
}

function roomOptionLabel(room, alreadyGenerated) {
  if (alreadyGenerated) return "Already generated";
  if (!room.memberId) return "No member";
  return room.memberId.name || "Assigned member";
}

function readyMessage(count, loading) {
  if (loading) return "Loading rooms...";
  return `${count} ${count === 1 ? "bill" : "bills"} ready to generate`;
}

function readyCount(count, loading) {
  return loading ? "..." : String(count);
}

function GenerateBillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMonth = searchParams.get("month") || currentMonth();

  const [month, setMonth] = useState(requestedMonth);
  const [dueDate, setDueDate] = useState(defaultDueDate(requestedMonth));
  const [rooms, setRooms] = useState([]);
  const [existingRoomIds, setExistingRoomIds] = useState(new Set());
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMonth(requestedMonth);
    setDueDate(defaultDueDate(requestedMonth));
  }, [requestedMonth]);

  useEffect(() => {
    async function loadPreview() {
      setLoading(true);
      setError("");

      try {
        const [roomsResult, billsResult] = await Promise.all([
          api.get("/rooms?status=ACTIVE"),
          api.get(`/billing?billingMonth=${encodeURIComponent(month)}`),
        ]);

        const activeRooms = Array.isArray(roomsResult.data)
          ? roomsResult.data
          : roomsResult.data?.rooms || [];
        const bills = Array.isArray(billsResult.data)
          ? billsResult.data
          : billsResult.data?.bills || [];

        setRooms(activeRooms);
        setExistingRoomIds(
          new Set(bills.map((bill) => String(bill.roomId?._id || bill.roomId)))
        );
      } catch (err) {
        setError(err.message || "Unable to load billing preview.");
      } finally {
        setLoading(false);
      }
    }

    loadPreview();
  }, [month]);

  const eligibleRooms = rooms.filter(
    (room) => room.memberId && !existingRoomIds.has(String(room._id))
  );

  const roomsToGenerate = selectedRoomId
    ? eligibleRooms.filter(
        (room) => String(room._id) === selectedRoomId
      )
    : eligibleRooms;

  async function generateBills(event) {
    event.preventDefault();
    setGenerating(true);
    setResult(null);
    setError("");

    let created = 0;
    let failed = 0;

    for (const room of roomsToGenerate) {
      try {
        await api.post("/billing/generate", {
          roomId: room._id,
          billingMonth: month,
          dueDate,
        });
        created += 1;
      } catch {
        failed += 1;
      }
    }

    setResult({
      created,
      skipped: roomsToGenerate.length - created - failed,
      failed,
    });
    setGenerating(false);

    if (created > 0 && failed === 0) {
      setExistingRoomIds(
        (previous) => new Set([
          ...previous,
          ...roomsToGenerate.map((room) => String(room._id)),
        ])
      );
    }
  }

  return (
    <AppShell>
      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            ← Back to Billing
          </button>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Finance
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Generate Monthly Bills
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a bill for one room or generate bills for every eligible room.
          </p>
        </div>

        <form
          onSubmit={generateBills}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="billing-room">Room</label>
              <select
                id="billing-room"
                className="input"
                value={selectedRoomId}
                onChange={(event) => setSelectedRoomId(event.target.value)}
                disabled={loading || generating}
              >
                <option value="">All eligible rooms</option>
                {rooms.map((room) => {
                  const roomId = String(room._id);
                  const alreadyGenerated = existingRoomIds.has(roomId);

                  return (
                    <option key={roomId} value={roomId}>
                      Room {room.roomNumber}
                      {` · ${roomOptionLabel(room, alreadyGenerated)}`}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="billing-month">Billing month *</label>
              <input
                id="billing-month"
                className="input"
                type="month"
                value={month}
                onChange={(event) => {
                  const nextMonth = event.target.value;
                  setMonth(nextMonth);
                  setDueDate(defaultDueDate(nextMonth));
                }}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="billing-due-date">Due date *</label>
              <input
                id="billing-due-date"
                className="input"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {formatMonth(month)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {readyMessage(roomsToGenerate.length, loading)}
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-950">
                {readyCount(roomsToGenerate.length, loading)}
              </p>
            </div>
          </div>

          {result && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Generated {result.created} bill{result.created === 1 ? "" : "s"}; skipped {result.skipped} existing or unassigned room{result.skipped === 1 ? "" : "s"}.
              {result.failed > 0 ? ` ${result.failed} failed.` : ""}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || generating || roomsToGenerate.length === 0}
              className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Bills"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default function GenerateBillingPage() {
  return (
    <Suspense fallback={null}>
      <GenerateBillingPageContent />
    </Suspense>
  );
}