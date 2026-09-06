"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Pencil,
  RefreshCw,
  Save,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";

const initialForm = {
  societyName: "Pawan Society",
  registrationNumber: "",
  sector: "7",
  area: "Khanda Colony",
  city: "New Panvel",
  state: "Maharashtra",
  pincode: "410206",
  address: "",
  contactNumber: "",
  email: "",
  financialYearStartMonth: "4",
  logoUrl: "",
};

export default function SocietySettingsPage() {
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

  async function loadSociety() {
    try {
      setLoading(true);

      const response = await api.get("/society");

      const data =
        response?.data?.society ||
        response?.data ||
        {};

      setForm((current) => ({
        ...current,
        ...data,
      }));
    } catch (error) {
      showToast(
        error?.message ||
          "Failed to load society settings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSociety();
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

      await api.put("/society", {
        ...form,
        financialYearStartMonth: Number(
          form.financialYearStartMonth || 4
        ),
      });

      showToast(
        "Society settings saved successfully."
      );
      setEditing(false);
    } catch (error) {
      showToast(
        error?.message ||
          "Failed to save society settings.",
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
        <Link
          href="/settings"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          ← Back to Settings
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Building2 size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Society Settings
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
              Manage society identity and contact information.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid gap-5 p-5 md:grid-cols-2">
            {[
              ["societyName", "Society Name"],
              ["registrationNumber", "Registration Number"],
              ["sector", "Sector"],
              ["area", "Area"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
              ["contactNumber", "Contact Number"],
              ["email", "Email"],
              ["logoUrl", "Logo URL"],
            ].map(([field, label]) => (
              <div key={field}>
                <label htmlFor={field} className="mb-2 block text-sm font-semibold text-slate-700">
                  {label}
                </label>

                <input
                  id={field}
                  value={form[field] ?? ""}
                  onChange={(e) =>
                    updateField(
                      field,
                      e.target.value
                    )
                  }
                  disabled={loading || !editing}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            ))}

            <div>
              <label htmlFor="financial-year-start" className="mb-2 block text-sm font-semibold text-slate-700">
                Financial Year Start Month
              </label>

              <select
                id="financial-year-start"
                value={form.financialYearStartMonth}
                onChange={(e) =>
                  updateField(
                    "financialYearStartMonth",
                    e.target.value
                  )
                }
                disabled={loading || !editing}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="1">January</option>
                <option value="4">April</option>
                <option value="7">July</option>
                <option value="10">October</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="society-address" className="mb-2 block text-sm font-semibold text-slate-700">
                Full Address
              </label>

              <textarea
                id="society-address"
                rows={4}
                value={form.address || ""}
                onChange={(e) =>
                  updateField(
                    "address",
                    e.target.value
                  )
                }
                disabled={loading || !editing}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadSociety();
                }}
                disabled={saving}
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
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

              {saving ? "Saving..." : "Save Society"}
              </button>
            </div>
          )}
        </form>
      </div>
    </AppShell>
  );
}