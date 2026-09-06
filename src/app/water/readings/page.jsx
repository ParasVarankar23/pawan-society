"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
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
  previousReading: "",
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

  useEffect(() => {
    async function loadFormData() {
      try {
        const [roomsResult, rateResult] = await Promise.all([
          api.get("/rooms?status=ACTIVE"),
          api.get("/water/rate"),
        ]);

        setRooms(
          Array.isArray(roomsResult.data)
            ? roomsResult.data
            : roomsResult.data?.rooms || []
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

  const units = Math.max(
    0,
    Number(form.currentReading || 0) -
      Number(form.previousReading || 0)
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

    if (
      form.previousReading === "" ||
      form.currentReading === ""
    ) {
      setError("Please enter both meter readings.");
      return;
    }

    if (Number(form.currentReading) < Number(form.previousReading)) {
      setError("Current reading cannot be less than the previous reading.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/water/readings", {
        roomId: form.roomId,
        memberId: selectedRoom.memberId._id,
        billingMonth: form.billingMonth,
        previousReading: Number(form.previousReading),
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
              <label className="label">Room *</label>
              <select
                className="input"
                value={form.roomId}
                onChange={(event) => updateField("roomId", event.target.value)}
                disabled={loading}
                required
              >
                <option value="">
                  {loading ? "Loading rooms..." : "Select room"}
                </option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber}
                    {room.memberId?.name ? ` · ${room.memberId.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Billing month *</label>
              <input
                className="input"
                type="month"
                value={form.billingMonth}
                onChange={(event) => updateField("billingMonth", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Previous reading *</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.previousReading}
                onChange={(event) => updateField("previousReading", event.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="label">Current reading *</label>
              <input
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
              <label className="label">Reading date</label>
              <input
                className="input"
                type="date"
                value={form.readingDate}
                onChange={(event) => updateField("readingDate", event.target.value)}
              />
            </div>

            <div>
              <label className="label">Remarks</label>
              <input
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