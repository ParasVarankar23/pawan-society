"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
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

function today() {
  return new Date().toISOString().split("T")[0];
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    { maximumFractionDigits: 2 }
  )}`;
}

const initialForm = {
  roomId: "",
  billingMonth: currentMonth(),
  currentReading: "",
  readingDate: today(),
  remarks: "",
};

export default function WaterReadingPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [rate, setRate] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [roomsResult, rateResult] = await Promise.all([
          api.get("/rooms?status=ACTIVE"),
          api.get("/water/rate"),
        ]);

        const roomList = Array.isArray(roomsResult.data)
          ? roomsResult.data
          : roomsResult.data?.rooms || [];

        setRooms(
          roomList.sort(
            (firstRoom, secondRoom) =>
              Number(firstRoom.roomNumber) -
              Number(secondRoom.roomNumber)
          )
        );
        setRate(Number(rateResult.data?.ratePerUnit || 0));
      } catch (err) {
        setError(err.message || "Unable to load water reading form.");
      } finally {
        setLoading(false);
      }
    }

    loadFormData();
  }, []);

  const selectedRoom = rooms.find(
    (room) => room._id === form.roomId
  );

  let selectedRoomLabel = "Select room";

  if (selectedRoom) {
    selectedRoomLabel = `Room ${selectedRoom.roomNumber}`;

    if (selectedRoom.memberId?.name) {
      selectedRoomLabel += ` · ${selectedRoom.memberId.name}`;
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const query = roomSearch.trim().toLowerCase();

    if (!query) return true;

    return (
      String(room.roomNumber).toLowerCase().includes(query) ||
      room.memberId?.name?.toLowerCase().includes(query)
    );
  });

  const units = Math.max(
    0,
    Number(form.currentReading || 0)
  );

  const amount = useMemo(
    () => units * rate,
    [units, rate]
  );

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.roomId) {
      setError("Please select a room.");
      return;
    }

    if (!selectedRoom?.memberId?._id) {
      setError("The selected room does not have a member assigned.");
      return;
    }

    if (form.currentReading === "") {
      setError("Please enter the current meter reading.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/water/readings", {
        roomId: form.roomId,
        memberId: selectedRoom.memberId._id,
        billingMonth: form.billingMonth,
        currentReading: Number(form.currentReading),
        ratePerUnit: rate,
        readingDate: form.readingDate,
        remarks: form.remarks.trim(),
      });

      router.push("/water");
    } catch (err) {
      setError(err.message || "Unable to record water reading.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            ← Back to Water
          </button>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Utility Management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Record Water Reading
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add the monthly meter reading for a society room.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="room-search" className="label">
                Room *
              </label>

              <div className="relative">
                <button
                  type="button"
                  className="input flex w-full items-center justify-between text-left disabled:opacity-50"
                  onClick={() => setRoomPickerOpen((open) => !open)}
                  disabled={loading}
                  aria-haspopup="listbox"
                  aria-expanded={roomPickerOpen}
                >
                  <span className={selectedRoom ? "text-slate-800" : "text-slate-400"}>
                    {loading ? "Loading rooms..." : selectedRoomLabel}
                  </span>
                  <span className="text-slate-400">▾</span>
                </button>

                {roomPickerOpen && !loading && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <input
                      id="room-search"
                      type="search"
                      value={roomSearch}
                      onChange={(event) => setRoomSearch(event.target.value)}
                      placeholder="Search room or member..."
                      className="input mb-2 h-10 w-full"
                    />

                    <div
                      className="max-h-32 overflow-y-auto overscroll-contain"
                      role="listbox"
                      aria-label="Rooms"
                    >
                      {filteredRooms.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-slate-500">
                          No rooms found.
                        </p>
                      ) : (
                        filteredRooms.map((room) => (
                          <button
                            key={room._id}
                            type="button"
                            role="option"
                            aria-selected={room._id === form.roomId}
                            onClick={() => {
                              updateField("roomId", room._id);
                              setRoomPickerOpen(false);
                              setRoomSearch("");
                            }}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${room._id === form.roomId ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700"}`}
                          >
                            Room {room.roomNumber}
                            {room.memberId?.name ? ` · ${room.memberId.name}` : ""}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="billingMonth" className="label">
                Billing month *
              </label>
              <input
                id="billingMonth"
                className="input"
                type="month"
                value={form.billingMonth}
                onChange={(event) => updateField("billingMonth", event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="currentReading" className="label">
                Current reading *
              </label>
              <input
                id="currentReading"
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.currentReading}
                onChange={(event) => updateField("currentReading", event.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="readingDate" className="label">
                Reading date
              </label>
              <input
                id="readingDate"
                className="input"
                type="date"
                value={form.readingDate}
                onChange={(event) => updateField("readingDate", event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="remarks" className="label">
                Remarks
              </label>
              <input
                id="remarks"
                className="input"
                value={form.remarks}
                onChange={(event) => updateField("remarks", event.target.value)}
                placeholder="Optional note"
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Rate per unit</p>
              <p className="mt-1 font-bold text-slate-900">{money(rate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Units consumed</p>
              <p className="mt-1 font-bold text-slate-900">{units.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Estimated charge</p>
              <p className="mt-1 font-bold text-blue-600">{money(amount)}</p>
            </div>
          </div>

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
              disabled={saving || loading}
              className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Reading"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}