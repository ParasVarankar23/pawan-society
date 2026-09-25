"use client";

import {
  CalendarDays,
  Edit3,
  FileImage,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function currentBillingMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

const initialForm = {
  billNumber: "",
  billingMonth: "",
  billDate: "",
  dueDate: "",
  amount: "",
  paidAmount: "0",
  paymentDate: "",
  paymentMode: "",
  referenceNumber: "",
  status: "UNPAID",
  attachmentUrl: "",
  remarks: "",
};

const paymentModeOptions = [
  { value: "UPI", label: "UPI" },
  { value: "CASH", label: "Cash" },
  { value: "GOOGLE_PAY", label: "Google Pay" },
  { value: "PHONEPE", label: "PhonePe" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "OTHER", label: "Other" },
];

const statusOptions = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

function dateInputValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

async function uploadToCloudinary(file) {
  const body = new FormData();
  body.append("file", file);

  const result = await api.upload("/uploads/cloudinary", body);

  if (!result.data?.secureUrl) {
    throw new Error(result.message || "Image upload failed.");
  }

  return result.data.secureUrl;
}

function getSaveLabel(saving, editingBill) {
  if (saving) return "Saving...";
  if (editingBill) return "Update Bill";
  return "Save Bill";
}

export default function ElectricityPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [billingMonth, setBillingMonth] = useState(currentBillingMonth);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paymentModeSearch, setPaymentModeSearch] = useState("");
  const [paymentModeOpen, setPaymentModeOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const paymentModeRef = useRef(null);
  const statusRef = useRef(null);

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
    function handleClickOutside(event) {
      if (
        paymentModeRef.current &&
        !paymentModeRef.current.contains(event.target)
      ) {
        setPaymentModeOpen(false);
      }

      if (
        statusRef.current &&
        !statusRef.current.contains(event.target)
      ) {
        setStatusOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddModal() {
    const today = new Date().toISOString().slice(0, 10);

    setEditingBill(null);
    setForm({
      ...initialForm,
      billingMonth,
      billDate: today,
    });
    setAttachmentFile(null);
    setPaymentModeSearch("");
    setStatusSearch("");
    setPaymentModeOpen(false);
    setStatusOpen(false);
    setShowModal(true);
  }

  function openEditModal(bill) {
    setEditingBill(bill);
    setForm({
      billNumber: bill.billNumber || "",
      billingMonth: bill.billingMonth || "",
      billDate: dateInputValue(bill.billDate),
      dueDate: dateInputValue(bill.dueDate),
      amount: bill.amount ?? "",
      paidAmount: bill.paidAmount ?? 0,
      paymentDate: dateInputValue(bill.paymentDate),
      paymentMode: bill.paymentMode || "",
      referenceNumber: bill.referenceNumber || "",
      status: bill.status || "UNPAID",
      attachmentUrl: bill.attachmentUrl || "",
      remarks: bill.remarks || "",
    });
    setAttachmentFile(null);
    setPaymentModeSearch("");
    setStatusSearch("");
    setPaymentModeOpen(false);
    setStatusOpen(false);
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditingBill(null);
    setAttachmentFile(null);
    setPaymentModeSearch("");
    setStatusSearch("");
    setPaymentModeOpen(false);
    setStatusOpen(false);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      let attachmentUrl = form.attachmentUrl;

      if (attachmentFile) {
        attachmentUrl = await uploadToCloudinary(attachmentFile);
      }

      const payload = {
        ...form,
        amount: Number(form.amount),
        paidAmount: Number(form.paidAmount || 0),
        attachmentUrl,
      };

      if (editingBill) {
        await api.put(`/electricity/${editingBill._id}`, payload);
      } else {
        await api.post("/electricity", payload);
      }

      closeModal();
      await loadBills();
      showToast(editingBill ? "Electricity bill updated." : "Electricity bill added.");
    } catch (error) {
      showToast(error?.message || "Unable to save electricity bill.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBill(bill) {
    if (!window.confirm(`Delete electricity bill ${bill.billNumber || "-"}?`)) {
      return;
    }

    try {
      await api.delete(`/electricity/${bill._id}`);
      await loadBills();
      showToast("Electricity bill deleted.");
    } catch (error) {
      showToast(error?.message || "Unable to delete electricity bill.", "error");
    }
  }

  async function loadBills() {
    try {
      setRefreshing(true);

      const query = billingMonth
        ? `?billingMonth=${encodeURIComponent(billingMonth)}`
        : "";

      const response = await api.get(
        `/electricity${query}`
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items ||
        response?.data?.bills ||
        [];

      setBills(data);
    } catch (error) {
      setBills([]);

      showToast(
        error?.message || "Failed to load electricity bills.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [billingMonth]);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bills;

    return bills.filter((bill) =>
      [
        bill.billNumber,
        bill.billingMonth,
        bill.referenceNumber,
        bill.paymentMode,
        bill.remarks,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [bills, search]);

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
    0
  );

  const saveLabel = getSaveLabel(saving, editingBill);

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Lightbulb size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Society Expenses
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Electricity
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage society electricity bills and payments
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={loadBills}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Bill
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Bills</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredBills.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bill number, reference..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="month"
                value={billingMonth}
                onChange={(e) =>
                  setBillingMonth(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Electricity Register
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Bill Date</th>
                  <th className="px-5 py-4">Bill No.</th>
                  <th className="px-5 py-4">Month</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-right">Paid</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 9 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No electricity bills found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(bill.billDate)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-indigo-600">
                        {bill.billNumber || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.billingMonth || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(bill.dueDate)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-slate-800">
                        {formatCurrency(bill.amount)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-emerald-600">
                        {formatCurrency(bill.paidAmount)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {bill.status || "UNPAID"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.paymentMode || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(bill)}
                            title="Edit bill"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBill(bill)}
                            title="Delete bill"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {editingBill ? "Edit Electricity Bill" : "Add Electricity Bill"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter bill details and optionally upload the bill image.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <FormField label="Bill Number *" htmlFor="electricity-bill-number">
                  <input id="electricity-bill-number" className="input" value={form.billNumber} onChange={(event) => updateField("billNumber", event.target.value)} required />
                </FormField>
                <FormField label="Billing Month *" htmlFor="electricity-billing-month">
                  <input id="electricity-billing-month" className="input" type="month" value={form.billingMonth} onChange={(event) => updateField("billingMonth", event.target.value)} required />
                </FormField>
                <FormField label="Bill Date *" htmlFor="electricity-bill-date">
                  <input id="electricity-bill-date" className="input" type="date" value={form.billDate} onChange={(event) => updateField("billDate", event.target.value)} required />
                </FormField>
                <FormField label="Due Date" htmlFor="electricity-due-date">
                  <input id="electricity-due-date" className="input" type="date" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} />
                </FormField>
                <FormField label="Amount *" htmlFor="electricity-amount">
                  <input id="electricity-amount" className="input" type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} required />
                </FormField>
                <FormField label="Paid Amount" htmlFor="electricity-paid-amount">
                  <input id="electricity-paid-amount" className="input" type="number" min="0" step="0.01" value={form.paidAmount} onChange={(event) => updateField("paidAmount", event.target.value)} />
                </FormField>
                <FormField label="Payment Date" htmlFor="electricity-payment-date">
                  <input id="electricity-payment-date" className="input" type="date" value={form.paymentDate} onChange={(event) => updateField("paymentDate", event.target.value)} />
                </FormField>
                <FormField label="Payment Mode" htmlFor="electricity-payment-mode">
                  <SearchableSelect
                    containerRef={paymentModeRef}
                    value={form.paymentMode}
                    options={paymentModeOptions}
                    search={paymentModeSearch}
                    open={paymentModeOpen}
                    setSearch={setPaymentModeSearch}
                    setOpen={setPaymentModeOpen}
                    onChange={(value) => updateField("paymentMode", value)}
                    placeholder="Search payment mode..."
                    inputId="electricity-payment-mode"
                  />
                </FormField>
                <FormField label="Status" htmlFor="electricity-status">
                  <SearchableSelect
                    containerRef={statusRef}
                    value={form.status}
                    options={statusOptions}
                    search={statusSearch}
                    open={statusOpen}
                    setSearch={setStatusSearch}
                    setOpen={setStatusOpen}
                    onChange={(value) => updateField("status", value)}
                    placeholder="Search status..."
                    inputId="electricity-status"
                  />
                </FormField>
                <FormField label="Reference Number" htmlFor="electricity-reference">
                  <input id="electricity-reference" className="input" value={form.referenceNumber} onChange={(event) => updateField("referenceNumber", event.target.value)} />
                </FormField>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="electricity-attachment">
                    Bill Image
                  </label>

                  <label
                    htmlFor="electricity-attachment"
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-4 transition hover:border-indigo-400 hover:bg-indigo-50/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        <FileImage size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {attachmentFile?.name || (form.attachmentUrl ? "Current bill image" : "Choose a bill image")}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          PNG, JPG or WEBP up to your Cloudinary limit
                        </p>
                      </div>
                    </div>
                    <Upload size={18} className="shrink-0 text-slate-500" />
                  </label>

                  <input
                    id="electricity-attachment"
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => setAttachmentFile(event.target.files?.[0] || null)}
                  />

                  {(form.attachmentUrl || attachmentFile) && (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2">
                      {form.attachmentUrl && !attachmentFile ? (
                        <a href={form.attachmentUrl} target="_blank" rel="noreferrer" className="truncate text-xs font-semibold text-indigo-600 hover:underline">
                          View current attachment
                        </a>
                      ) : (
                        <span className="truncate text-xs font-medium text-slate-600">
                          Ready to upload: {attachmentFile?.name}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentFile(null);
                          updateField("attachmentUrl", "");
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        title="Remove bill image"
                        aria-label="Remove bill image"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <FormField label="Remarks" htmlFor="electricity-remarks">
                    <textarea id="electricity-remarks" className="input min-h-24 resize-y" value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                  {saveLabel}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SearchableSelect({
  containerRef,
  value,
  options,
  search,
  open,
  setSearch,
  setOpen,
  onChange,
  placeholder,
  inputId,
}) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ||
    "Select option";
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        id={inputId}
        type="button"
        className="input flex w-full items-center justify-between text-left"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {selectedLabel}
        </span>
        <span className="text-slate-500">⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <input
            type="search"
            className="input h-10 w-full"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />

          <div className="mt-2 max-h-40 overflow-y-auto" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${value === option.value ? "bg-slate-50 font-semibold text-slate-950" : "text-slate-700"}`}
                  onClick={() => {
                    onChange(option.value);
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-slate-400">
                No options found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}