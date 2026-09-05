"use client";

import { useEffect, useState } from "react";
import {
  Percent,
  RefreshCw,
  Save,
  ShieldAlert,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

const initialForm = {
  enabled: true,
  rateType: "PERCENTAGE",
  rate: "12",
  gracePeriodDays: "0",
  calculationType: "ON_OUTSTANDING",
  frequency: "MONTHLY",
  effectiveFrom: "",
  effectiveTo: "",
  notes: "",
};

export default function PenaltySettingsPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      const response = await api.get(
        "/penalties/config"
      );

      const data =
        response?.data?.penalty ||
        response?.data?.item ||
        response?.data ||
        {};

      setForm((current) => ({
        ...current,
        ...data,
      }));
    } catch (error) {
      showToast(
        error?.message ||
          "Failed to load penalty settings.",
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

      await api.post(
        "/penalties/config",
        {
          ...form,
          rate: Number(form.rate || 0),
          gracePeriodDays: Number(
            form.gracePeriodDays || 0
          ),
        }
      );

      showToast(
        "Penalty settings saved successfully."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Failed to save penalty settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

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
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <ShieldAlert size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Penalty Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure the society's overdue penalty calculation.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.enabled)}
                  onChange={(e) =>
                    updateField(
                      "enabled",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Enable penalty calculation
                </span>
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Rate Type
              </label>

              <select
                value={form.rateType}
                onChange={(e) =>
                  updateField(
                    "rateType",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="PERCENTAGE">
                  Percentage
                </option>
                <option value="FIXED_AMOUNT">
                  Fixed Amount
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Rate
              </label>

              <div className="relative">
                <Percent
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) =>
                    updateField(
                      "rate",
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Grace Period (Days)
              </label>

              <input
                type="number"
                min="0"
                value={form.gracePeriodDays}
                onChange={(e) =>
                  updateField(
                    "gracePeriodDays",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Calculation Type
              </label>

              <select
                value={form.calculationType}
                onChange={(e) =>
                  updateField(
                    "calculationType",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="ON_OUTSTANDING">
                  Outstanding
                </option>
                <option value="ON_CURRENT_BILL">
                  Current Bill
                </option>
                <option value="ON_PRINCIPAL">
                  Principal
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Frequency
              </label>

              <select
                value={form.frequency}
                onChange={(e) =>
                  updateField(
                    "frequency",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="ONE_TIME">
                  One Time
                </option>
                <option value="MONTHLY">
                  Monthly
                </option>
                <option value="DAILY">
                  Daily
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Effective From
              </label>

              <input
                type="date"
                value={form.effectiveFrom || ""}
                onChange={(e) =>
                  updateField(
                    "effectiveFrom",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Effective To
              </label>

              <input
                type="date"
                value={form.effectiveTo || ""}
                onChange={(e) =>
                  updateField(
                    "effectiveTo",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                value={form.notes || ""}
                onChange={(e) =>
                  updateField(
                    "notes",
                    e.target.value
                  )
                }
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                placeholder="Add notes about this penalty rule..."
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 p-5">
            <button
              type="submit"
              disabled={saving || loading}
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

              {saving ? "Saving..." : "Save Penalty Rule"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}