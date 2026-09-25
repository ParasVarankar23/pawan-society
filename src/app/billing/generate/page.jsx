"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

function currentMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function defaultDueDate(month) {
  const billingDate = new Date(`${month}-01T00:00:00`);
  billingDate.setMonth(billingDate.getMonth() + 1);
  billingDate.setDate(15);

  return `${billingDate.getFullYear()}-${String(
    billingDate.getMonth() + 1
  ).padStart(2, "0")}-15`;
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
  const [roomSearch, setRoomSearch] = useState("");
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const roomPickerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        roomPickerRef.current &&
        !roomPickerRef.current.contains(event.target)
      ) {
        setRoomPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        setRooms(
          activeRooms.sort(
            (firstRoom, secondRoom) =>
              Number(firstRoom.roomNumber) -
              Number(secondRoom.roomNumber)
          )
        );
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

  const filteredRooms = eligibleRooms.filter((room) => {
    const query = roomSearch.trim().toLowerCase();

    if (!query) return true;

    return (
      String(room.roomNumber).toLowerCase().includes(query) ||
      room.memberId?.name?.toLowerCase().includes(query)
    );
  });

  const selectedRoom = eligibleRooms.find(
    (room) => String(room._id) === selectedRoomId
  );

  let selectedRoomLabel = "All eligible rooms";

  if (selectedRoom) {
    selectedRoomLabel = `Room ${selectedRoom.roomNumber}`;

    if (selectedRoom.memberId?.name) {
      selectedRoomLabel += ` · ${selectedRoom.memberId.name}`;
    }
  }

  async function generateBills(event) {
    event.preventDefault();
    setGenerating(true);
    setResult(null);
    setError("");

    let created = 0;
    let failed = 0;
    let emailFailed = 0;
    const failureMessages = [];

    for (const room of roomsToGenerate) {
      try {
        const response = await api.post("/billing/generate", {
          roomId: room._id,
          billingMonth: month,
          dueDate,
        });
        created += 1;

        if (response.data?.emailStatus === "FAILED") {
          emailFailed += 1;
        }
      } catch (error) {
        failed += 1;
        if (error?.message) {
          failureMessages.push(error.message);
        }
      }
    }

    setResult({
      created,
      skipped: roomsToGenerate.length - created - failed,
      failed,
      emailFailed,
    });
    if (failureMessages.length > 0) {
      setError(failureMessages[0]);
    } else if (emailFailed > 0) {
      setError(
        `${emailFailed} bill${emailFailed === 1 ? "" : "s"} created, but email delivery failed. Check the Emails page for details.`
      );
    }
    setGenerating(false);

    if (created > 0 && failed === 0) {
      setExistingRoomIds(
        (previous) => new Set([
          ...previous,
          ...roomsToGenerate.map((room) => String(room._id)),
        ])
      );

      router.push("/billing");
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
              <div ref={roomPickerRef} className="relative">
                <button
                  id="billing-room"
                  type="button"
                  className="input flex w-full items-center justify-between text-left disabled:opacity-50"
                  onClick={() => setRoomPickerOpen((open) => !open)}
                  disabled={loading || generating}
                  aria-haspopup="listbox"
                  aria-expanded={roomPickerOpen}
                >
                  <span className={selectedRoom ? "text-slate-800" : "text-slate-500"}>
                    {selectedRoomLabel}
                  </span>
                  <span className="text-slate-400">▾</span>
                </button>

                {roomPickerOpen && !loading && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <input
                      type="search"
                      value={roomSearch}
                      onChange={(event) => setRoomSearch(event.target.value)}
                      placeholder="Search room or member..."
                      className="input mb-2 h-10 w-full"
                    />

                    <div
                      className="max-h-32 overflow-y-auto overscroll-contain"
                      role="listbox"
                      aria-label="Eligible rooms"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={!selectedRoomId}
                        onClick={() => {
                          setSelectedRoomId("");
                          setRoomPickerOpen(false);
                          setRoomSearch("");
                        }}
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${!selectedRoomId ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700"}`}
                      >
                        All eligible rooms
                      </button>

                      {filteredRooms.map((room) => (
                        <button
                          key={room._id}
                          type="button"
                          role="option"
                          aria-selected={String(room._id) === selectedRoomId}
                          onClick={() => {
                            setSelectedRoomId(String(room._id));
                            setRoomPickerOpen(false);
                            setRoomSearch("");
                          }}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${String(room._id) === selectedRoomId ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700"}`}
                        >
                          Room {room.roomNumber} · {room.memberId.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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