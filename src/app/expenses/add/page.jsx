"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Toast from "@/components/common/Toast";
import api from "@/lib/apiClient";
import {
  PAYMENT_MODES,
  PAYMENT_MODE_LABELS,
} from "@/constants/paymentModes";

function today() {
  return new Date().toISOString().split("T")[0];
}

const initialForm = {
  date: today(),
  category: "",
  vendorName: "",
  billNumber: "",
  description: "",
  amount: "",
  paymentMode: "CASH",
  paymentDate: today(),
  referenceNumber: "",
  attachmentUrl: "",
};

export default function AddExpensePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await api.get("/expenses/categories");
        const data = Array.isArray(result.data)
          ? result.data
          : result.data?.categories || result.data?.items || [];
        setCategories(data);
      } catch (err) {
        setError(err.message || "Unable to load expense categories.");
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

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.category || !form.description.trim()) {
      setError("Please select a category and enter a description.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Expense amount must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/expenses", {
        date: form.date,
        category: form.category,
        vendorName: form.vendorName.trim(),
        billNumber: form.billNumber.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        paymentMode: form.paymentMode,
        paymentDate: form.paymentDate || null,
        referenceNumber: form.referenceNumber.trim(),
        attachmentUrl: form.attachmentUrl.trim(),
      });

      router.push("/expenses");
    } catch (err) {
      setError(err.message || "Unable to save expense.");
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

      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            ← Back to Expenses
          </button>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Finance
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Add Expense
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record a society expense and its payment details.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <section>
            <h2 className="text-base font-bold text-slate-900">Expense details</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="expense-date">Expense date *</label>
                <input id="expense-date" className="input" type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="expense-category">Category *</label>
                <select id="expense-category" className="input" value={form.category} onChange={(event) => updateField("category", event.target.value)} disabled={loading} required>
                  <option value="">{loading ? "Loading categories..." : "Select category"}</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="expense-description">Description *</label>
                <input id="expense-description" className="input" value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="What was purchased or repaired?" required />
              </div>
              <div>
                <label className="label" htmlFor="expense-amount">Amount *</label>
                <input id="expense-amount" className="input" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} placeholder="0.00" required />
              </div>
              <div>
                <label className="label" htmlFor="vendor-name">Vendor</label>
                <input id="vendor-name" className="input" value={form.vendorName} onChange={(event) => updateField("vendorName", event.target.value)} placeholder="Vendor or supplier" />
              </div>
              <div>
                <label className="label" htmlFor="bill-number">Bill number</label>
                <input id="bill-number" className="input" value={form.billNumber} onChange={(event) => updateField("billNumber", event.target.value)} />
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">Payment details</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="payment-mode">Payment mode *</label>
                <select id="payment-mode" className="input" value={form.paymentMode} onChange={(event) => updateField("paymentMode", event.target.value)}>
                  {PAYMENT_MODES.map((mode) => <option key={mode} value={mode}>{PAYMENT_MODE_LABELS[mode]}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="payment-date">Payment date</label>
                <input id="payment-date" className="input" type="date" value={form.paymentDate} onChange={(event) => updateField("paymentDate", event.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="reference-number">Reference number</label>
                <input id="reference-number" className="input" value={form.referenceNumber} onChange={(event) => updateField("referenceNumber", event.target.value)} placeholder="Cheque, UPI, or transfer reference" />
              </div>
              <div>
                <label className="label" htmlFor="attachment-url">Attachment URL</label>
                <input id="attachment-url" className="input" value={form.attachmentUrl} onChange={(event) => updateField("attachmentUrl", event.target.value)} placeholder="Optional receipt link" />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => router.back()} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving || loading} className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving ? "Saving..." : "Save Expense"}</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}