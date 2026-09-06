"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Pencil,
  IndianRupee,
  RefreshCw,
  Save,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

const initialForm = {
  maintenance: "",
  sinkingFund: "",
  insurance: "",
  educationFund: "",
  parking: "",
  nonOccupancy: "",
  rentNoc: "",
  other: "",
  waterRatePerUnit: "9",
  effectiveFrom: "",
};

export default function ChargesSettingsPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

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

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await api.get("/charges");

      const data =
        response?.data?.charge ||
        response?.data?.item ||
        response?.data ||
        {};

      const effectiveFrom = data.effectiveFrom
        ? new Date(data.effectiveFrom)
            .toISOString()
            .split("T")[0]
        : "";

      setForm((current) => ({
        ...current,
        ...data,
        effectiveFrom,
      }));
    } catch (error) {
      showToast(
        error?.message || "Failed to load charge settings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      await api.post("/charges", {
        ...form,
        maintenance: Number(form.maintenance || 0),
        sinkingFund: Number(form.sinkingFund || 0),
        insurance: Number(form.insurance || 0),
        educationFund: Number(form.educationFund || 0),
        parking: Number(form.parking || 0),
        nonOccupancy: Number(form.nonOccupancy || 0),
        rentNoc: Number(form.rentNoc || 0),
        other: Number(form.other || 0),
        waterRatePerUnit: Number(
          form.waterRatePerUnit || 0
        ),
      });

      showToast("Charge settings saved successfully.");
      setEditing(false);
    } catch (error) {
      showToast(
        error?.message || "Failed to save charge settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    ["maintenance", "Maintenance"],
    ["sinkingFund", "Sinking Fund"],
    ["insurance", "Insurance"],
    ["educationFund", "Education Fund"],
    ["parking", "Parking"],
    ["nonOccupancy", "Non-Occupancy"],
    ["rentNoc", "Rent NOC"],
    ["other", "Other Charges"],
    ["waterRatePerUnit", "Water Rate / Unit"],
  ];

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
        <Link
          href="/settings"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          ← Back to Settings
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Calculator size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Charges & Rates
              </h1>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  disabled={loading}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Configure billing charges and water rate.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {fields.map(([name, label]) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {label}
                </label>

                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id={name}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form[name] ?? ""}
                    onChange={(e) =>
                      updateField(name, e.target.value)
                    }
                    disabled={loading || !editing}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            ))}

            <div>
              <label
                htmlFor="effective-from"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Effective From
              </label>

              <input
                id="effective-from"
                type="date"
                value={form.effectiveFrom || ""}
                onChange={(e) =>
                  updateField(
                    "effectiveFrom",
                    e.target.value
                  )
                }
                disabled={loading || !editing}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadSettings();
                }}
                disabled={saving}
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Saving..." : "Save Charges"}
              </button>
            </div>
          )}
        </form>
      </div>
    </AppShell>
  );
}