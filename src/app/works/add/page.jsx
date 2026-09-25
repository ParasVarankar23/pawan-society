"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

const initialForm = {
  workName: "",
  category: "",
  vendorName: "",
  description: "",
  startDate: "",
  completionDate: "",
  estimatedCost: "",
  actualCost: "",
  billNumber: "",
  paymentStatus: "UNPAID",
  paymentMode: "",
  paymentDate: "",
  referenceNumber: "",
  status: "PLANNED",
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function AddWorkPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentStatusSearch, setPaymentStatusSearch] = useState("");
  const [paymentStatusOpen, setPaymentStatusOpen] = useState(false);
  const [paymentModeSearch, setPaymentModeSearch] = useState("");
  const [paymentModeOpen, setPaymentModeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await api.get("/works/categories");
        const data = Array.isArray(result.data)
          ? result.data
          : result.data?.categories || [];
        setCategories(data);
      } catch (err) {
        setError(err.message || "Unable to load work categories.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const filteredCategories = categories.filter((category) => {
    const label = typeof category === "string"
      ? category
      : category.label || category.name || category.value || "";

    return label.toLowerCase().includes(categorySearch.trim().toLowerCase());
  });

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.workName.trim() || !form.category) {
      setError("Please enter a work name and select a category.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/works", {
        workName: form.workName.trim(),
        category: form.category,
        vendorName: form.vendorName.trim(),
        description: form.description.trim(),
        startDate: form.startDate || null,
        completionDate: form.completionDate || null,
        estimatedCost: Number(form.estimatedCost || 0),
        actualCost: Number(form.actualCost || 0),
        billNumber: form.billNumber.trim(),
        paymentStatus: form.paymentStatus,
        paymentMode: form.paymentMode,
        paymentDate: form.paymentDate || null,
        referenceNumber: form.referenceNumber.trim(),
        status: form.status,
      });

      router.push("/works");
    } catch (err) {
      setError(err.message || "Unable to save society work.");
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

      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            ← Back to Works
          </button>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Society Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Add Society Work
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record a maintenance, repair, or improvement project.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <section>
            <h2 className="text-base font-bold text-slate-900">Work details</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="work-name">Work name *</label>
                <input
                  id="work-name"
                  className="input"
                  value={form.workName}
                  onChange={(event) => updateField("workName", event.target.value)}
                  placeholder="e.g. Terrace waterproofing"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="work-category">Category *</label>
                <div className="relative">
                  <button
                    id="work-category"
                    type="button"
                    className="input flex w-full items-center justify-between text-left"
                    onClick={() => setCategoryOpen((open) => !open)}
                    disabled={loading}
                    aria-haspopup="listbox"
                    aria-expanded={categoryOpen}
                  >
                    <span className={form.category ? "text-slate-800" : "text-slate-400"}>
                      {form.category || (loading ? "Loading categories..." : "Select category")}
                    </span>
                    <span className="text-slate-400">▾</span>
                  </button>

                  {categoryOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      <input
                        className="input"
                        value={categorySearch}
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder="Search category..."
                        aria-label="Search work categories"
                      />
                      <div className="mt-2 max-h-56 overflow-y-auto">
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
                          onClick={() => {
                            updateField("category", "");
                            setCategoryOpen(false);
                          }}
                        >
                          Select category
                        </button>
                        {filteredCategories.map((category) => {
                          const value = typeof category === "string" ? category : category.value || category.name;
                          const label = typeof category === "string" ? category : category.label || category.name || value;
                          return (
                            <button
                              key={value}
                              type="button"
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => {
                                updateField("category", value);
                                setCategorySearch("");
                                setCategoryOpen(false);
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="vendor-name">Vendor</label>
                <input
                  id="vendor-name"
                  className="input"
                  value={form.vendorName}
                  onChange={(event) => updateField("vendorName", event.target.value)}
                  placeholder="Vendor or contractor"
                />
              </div>
              <div>
                <p className="label">Status</p>
                <div className="relative">
                  <button type="button" className="input flex w-full items-center justify-between text-left" onClick={() => setStatusOpen((open) => !open)} aria-expanded={statusOpen}>
                    <span className="text-slate-800">{statusLabel(form.status)}</span>
                    <span className="text-slate-400">▾</span>
                  </button>
                  {statusOpen && (
                    <StatusMenu
                      search={statusSearch}
                      setSearch={setStatusSearch}
                      value={form.status}
                      onChange={(value) => { updateField("status", value); setStatusSearch(""); setStatusOpen(false); }}
                    />
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="work-description">Description</label>
                <textarea
                  id="work-description"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400"
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe the work and scope"
                />
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">Schedule and cost</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["start-date", "Start date", "startDate"],
                ["completion-date", "Completion date", "completionDate"],
                ["estimated-cost", "Estimated cost", "estimatedCost"],
                ["actual-cost", "Actual cost", "actualCost"],
              ].map(([id, label, field]) => (
                <div key={field}>
                  <label className="label" htmlFor={id}>{label}</label>
                  <input
                    id={id}
                    className="input"
                    type={field.toLowerCase().includes("cost") ? "number" : "date"}
                    min={field.toLowerCase().includes("cost") ? "0" : undefined}
                    step={field.toLowerCase().includes("cost") ? "0.01" : undefined}
                    value={form[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">Payment details</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label" htmlFor="bill-number">Bill number</label>
                <input id="bill-number" className="input" value={form.billNumber} onChange={(event) => updateField("billNumber", event.target.value)} />
              </div>
              <div>
                <p className="label">Payment status</p>
                <div className="relative">
                  <button type="button" className="input flex w-full items-center justify-between text-left" onClick={() => setPaymentStatusOpen((open) => !open)} aria-expanded={paymentStatusOpen}>
                    <span className="text-slate-800">{paymentStatusLabel(form.paymentStatus)}</span>
                    <span className="text-slate-400">▾</span>
                  </button>
                  {paymentStatusOpen && <SearchableMenu search={paymentStatusSearch} setSearch={setPaymentStatusSearch} value={form.paymentStatus} onChange={(value) => { updateField("paymentStatus", value); setPaymentStatusSearch(""); setPaymentStatusOpen(false); }} options={paymentStatusOptions} placeholder="Search payment status..." />}
                </div>
              </div>
              <div>
                <p className="label">Payment mode</p>
                <div className="relative">
                  <button type="button" className="input flex w-full items-center justify-between text-left" onClick={() => setPaymentModeOpen((open) => !open)} aria-expanded={paymentModeOpen}>
                    <span className={form.paymentMode ? "text-slate-800" : "text-slate-400"}>{form.paymentMode || "Select payment mode"}</span>
                    <span className="text-slate-400">▾</span>
                  </button>
                  {paymentModeOpen && <SearchableMenu search={paymentModeSearch} setSearch={setPaymentModeSearch} value={form.paymentMode} onChange={(value) => { updateField("paymentMode", value); setPaymentModeSearch(""); setPaymentModeOpen(false); }} options={paymentModeOptions} placeholder="Search payment mode..." />}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="payment-date">Payment date</label>
                <input id="payment-date" className="input" type="date" value={form.paymentDate} onChange={(event) => updateField("paymentDate", event.target.value)} />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="label" htmlFor="reference-number">Reference number</label>
                <input id="reference-number" className="input" value={form.referenceNumber} onChange={(event) => updateField("referenceNumber", event.target.value)} placeholder="Optional transaction reference" />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => router.back()} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving || loading} className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
              {saving ? "Saving..." : "Save Work"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

const statusOptions = [
  ["PLANNED", "Planned"],
  ["IN_PROGRESS", "In Progress"],
  ["COMPLETED", "Completed"],
];

function statusLabel(value) {
  return statusOptions.find(([optionValue]) => optionValue === value)?.[1] || "Planned";
}

function StatusMenu({ search, setSearch, value, onChange }) {
  return <SearchableMenu search={search} setSearch={setSearch} value={value} onChange={onChange} options={statusOptions} placeholder="Search status..." />;
}

const paymentStatusOptions = [
  ["UNPAID", "Unpaid"],
  ["PARTIAL", "Partial"],
  ["PAID", "Paid"],
];

const paymentModeOptions = [
  ["CASH", "Cash"],
  ["CHEQUE", "Cheque"],
  ["BANK_TRANSFER", "Bank Transfer"],
  ["UPI", "UPI"],
  ["GPAY", "Google Pay"],
  ["PAYTM", "Paytm"],
  ["PHONEPE", "PhonePe"],
  ["NEFT", "NEFT"],
  ["RTGS", "RTGS"],
  ["IMPS", "IMPS"],
  ["OTHER", "Other"],
];

function paymentStatusLabel(value) {
  return paymentStatusOptions.find(([optionValue]) => optionValue === value)?.[1] || "Unpaid";
}

function SearchableMenu({ search, setSearch, value, onChange, options, placeholder }) {
  const filteredOptions = options.filter(([, label]) => label.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
      <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
      <div className="mt-2 max-h-40 overflow-y-auto">
        {filteredOptions.map(([optionValue, label]) => (
          <button key={optionValue} type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${value === optionValue ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"}`} onClick={() => onChange(optionValue)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}