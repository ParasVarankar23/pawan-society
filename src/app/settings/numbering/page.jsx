"use client";

import { useEffect, useState } from "react";
import {
  FileCog,
  Hash,
  RefreshCw,
  Save,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

export default function NumberingSettingsPage() {
  const [form, setForm] = useState({
    billPrefix: "BILL",
    receiptPrefix: "REC",
    billSequence: "1",
    receiptSequence: "1",
  });

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

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);

        const response = await api.get(
          "/settings/numbering"
        );

        const data =
          response?.data?.settings ||
          response?.data ||
          {};

        setForm((current) => ({
          ...current,
          ...data,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

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

      await api.put(
        "/settings/numbering",
        {
          ...form,
          billSequence: Number(
            form.billSequence || 1
          ),
          receiptSequence: Number(
            form.receiptSequence || 1
          ),
        }
      );

      showToast(
        "Numbering settings saved successfully."
      );
    } catch (error) {
      showToast(
        error?.message ||
          "Numbering API is not available yet.",
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <FileCog size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Numbering Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure bill and receipt numbering.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bill Prefix
              </label>

              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={form.billPrefix}
                  onChange={(e) =>
                    updateField(
                      "billPrefix",
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Receipt Prefix
              </label>

              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={form.receiptPrefix}
                  onChange={(e) =>
                    updateField(
                      "receiptPrefix",
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bill Starting Sequence
              </label>

              <input
                type="number"
                min="1"
                value={form.billSequence}
                onChange={(e) =>
                  updateField(
                    "billSequence",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Receipt Starting Sequence
              </label>

              <input
                type="number"
                min="1"
                value={form.receiptSequence}
                onChange={(e) =>
                  updateField(
                    "receiptSequence",
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-5">
            <p className="text-sm leading-6 text-slate-600">
              Bill and receipt numbers should ultimately be generated
              through the existing atomic <strong>Counter</strong>
              collection. Do not generate numbers with a client-side
              counter.
            </p>
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

              {saving ? "Saving..." : "Save Numbering"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}