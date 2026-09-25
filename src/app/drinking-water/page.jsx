"use client";

import {
  ChevronDown,
  Droplets,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
  X
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

function currentDateRange() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return {
    fromDate: `${year}-${month}-01`,
    toDate: `${year}-${month}-${day}`,
  };
}

const initialForm = {
  supplierName: "",
  billNumber: "",
  billDate: new Date().toISOString().slice(0, 10),
  quantity: "",
  unit: "Litre",
  rate: "9",
  amount: "",
  paymentMode: "CASH",
  paymentDate: "",
  referenceNumber: "",
  attachmentUrl: "",
  remarks: "",
};

const paymentModeOptions = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "GOOGLE_PAY", label: "Google Pay" },
  { value: "PHONEPE", label: "PhonePe" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "OTHER", label: "Other" },
];

function dateInputValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export default function DrinkingWaterPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const defaultDateRange = currentDateRange();
  const [fromDate, setFromDate] = useState(defaultDateRange.fromDate);
  const [toDate, setToDate] = useState(defaultDateRange.toDate);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [paymentModeSearch, setPaymentModeSearch] = useState("");
  const [paymentModeOpen, setPaymentModeOpen] = useState(false);
  const paymentModeRef = useRef(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "quantity" || field === "rate") {
        const quantity = Number(
          field === "quantity" ? value : current.quantity
        );
        const rate = Number(
          field === "rate" ? value : current.rate
        );

        next.amount = quantity > 0 && rate >= 0
          ? String(quantity * rate)
          : "";
      }

      return next;
    });
  }

  function openAddModal() {
    setEditingBill(null);
    setForm({ ...initialForm });
    setPaymentModeSearch("");
    setPaymentModeOpen(false);
    setShowModal(true);
  }

  function openEditModal(bill) {
    setEditingBill(bill);
    setForm({
      supplierName: bill.supplierName || "",
      billNumber: bill.billNumber || "",
      billDate: dateInputValue(bill.billDate),
      quantity: bill.quantity ?? "",
      unit: bill.unit || "Litre",
      rate: bill.rate ?? "9",
      amount: bill.quantity && bill.rate !== undefined
        ? String(Number(bill.quantity) * Number(bill.rate))
        : bill.amount ?? "",
      paymentMode: bill.paymentMode || "CASH",
      paymentDate: dateInputValue(bill.paymentDate),
      referenceNumber: bill.referenceNumber || "",
      attachmentUrl: bill.attachmentUrl || "",
      remarks: bill.remarks || "",
    });
    setPaymentModeSearch("");
    setPaymentModeOpen(false);
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditingBill(null);
    setForm({ ...initialForm });
    setPaymentModeSearch("");
    setPaymentModeOpen(false);
  }

  async function submitBill(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        supplierName: form.supplierName.trim(),
        billNumber: form.billNumber.trim(),
        quantity: Number(form.quantity || 0),
        rate: Number(form.rate || 0),
        amount: Number(form.amount),
        paymentDate: form.paymentDate || null,
        referenceNumber: form.referenceNumber.trim(),
        attachmentUrl: form.attachmentUrl.trim(),
        remarks: form.remarks.trim(),
      };

      if (editingBill) {
        await api.put(`/drinking-water/${editingBill._id}`, payload);
      } else {
        await api.post("/drinking-water", payload);
      }

      closeModal();
      await loadBills();
      showToast(editingBill ? "Drinking water bill updated." : "Drinking water bill added.");
    } catch (error) {
      showToast(error?.message || "Unable to save drinking water bill.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBill(bill) {
    if (!window.confirm(`Delete drinking water bill ${bill.billNumber || "-"}?`)) {
      return;
    }

    try {
      await api.delete(`/drinking-water/${bill._id}`);
      await loadBills();
      showToast("Drinking water bill deleted.");
    } catch (error) {
      showToast(error?.message || "Unable to delete drinking water bill.", "error");
    }
  }

  async function loadBills() {
    try {
      setRefreshing(true);

      const params = new URLSearchParams();

      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const query = params.toString();

      const response = await api.get(
        `/drinking-water${query ? `?${query}` : ""}`
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
        error?.message || "Failed to load drinking water bills.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, [fromDate, toDate]);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bills;

    return bills.filter((bill) =>
      [
        bill.supplierName,
        bill.billNumber,
        bill.unit,
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

  const totalQuantity = filteredBills.reduce(
    (sum, bill) => sum + Number(bill.quantity || 0),
    0
  );

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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              <Droplets size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Society Expenses
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Drinking Water
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage drinking water supplier bills and payments
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
            <p className="text-sm text-slate-500">Total Quantity</p>
            <p className="mt-2 text-2xl font-bold text-cyan-600">
              {totalQuantity}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search supplier, bill number..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Drinking Water Register
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase text-slate-500">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Supplier</th>
                  <th className="px-5 py-4">Bill No.</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Rate</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 8 }).map((__, cell) => (
                        <td key={cell} className="px-5 py-5">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <WalletCards
                        size={40}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-4 font-semibold text-slate-700">
                        No drinking water bills found
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

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {bill.supplierName || "-"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-indigo-600">
                        {bill.billNumber || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {bill.quantity || 0} {bill.unit || ""}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatCurrency(bill.rate || 0)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-600">
                        {formatCurrency(bill.amount || 0)}
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
              onSubmit={submitBill}
              className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {editingBill ? "Edit Drinking Water Bill" : "Add Drinking Water Bill"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Enter supplier, quantity, payment and bill details.</p>
                </div>
                <button type="button" onClick={closeModal} disabled={saving} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <label className="label" htmlFor="water-supplier">Supplier *<input id="water-supplier" className="input mt-1" value={form.supplierName} onChange={(event) => updateField("supplierName", event.target.value)} required /></label>
                <label className="label" htmlFor="water-bill-number">Bill number<input id="water-bill-number" className="input mt-1" value={form.billNumber} onChange={(event) => updateField("billNumber", event.target.value)} /></label>
                <label className="label" htmlFor="water-bill-date">Bill date *<input id="water-bill-date" className="input mt-1" type="date" value={form.billDate} onChange={(event) => updateField("billDate", event.target.value)} required /></label>
                <label className="label" htmlFor="water-quantity">Quantity<input id="water-quantity" className="input mt-1" type="number" min="0" step="0.01" value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} /></label>
                <label className="label" htmlFor="water-unit">Unit<input id="water-unit" className="input mt-1" value={form.unit} onChange={(event) => updateField("unit", event.target.value)} /></label>
                <label className="label" htmlFor="water-rate">Rate<input id="water-rate" className="input mt-1" type="number" min="0" step="0.01" value={form.rate} onChange={(event) => updateField("rate", event.target.value)} /></label>
                <label className="label" htmlFor="water-amount">Amount *<input id="water-amount" className="input mt-1 bg-slate-50" type="number" value={form.amount} readOnly required /></label>
                <div>
                  <label className="label" htmlFor="water-payment-mode">Payment mode</label>
                  <div ref={paymentModeRef} className="relative">
                    <button
                      id="water-payment-mode"
                      type="button"
                      className="input flex w-full items-center justify-between text-left"
                      onClick={() => setPaymentModeOpen((current) => !current)}
                      aria-haspopup="listbox"
                      aria-expanded={paymentModeOpen}
                    >
                      <span className="text-slate-800">
                        {paymentModeOptions.find((option) => option.value === form.paymentMode)?.label || "Select payment mode"}
                      </span>
                      <ChevronDown size={16} className="text-slate-500" />
                    </button>

                    {paymentModeOpen && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        <input
                          type="search"
                          value={paymentModeSearch}
                          onChange={(event) => setPaymentModeSearch(event.target.value)}
                          placeholder="Search payment mode..."
                          className="input h-10 w-full"
                          aria-label="Search payment mode"
                        />
                        <div className="mt-2 max-h-40 overflow-y-auto" role="listbox">
                          {paymentModeOptions
                            .filter((option) => option.label.toLowerCase().includes(paymentModeSearch.trim().toLowerCase()))
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={form.paymentMode === option.value}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${form.paymentMode === option.value ? "bg-slate-50 font-semibold text-slate-950" : "text-slate-700"}`}
                                onClick={() => {
                                  updateField("paymentMode", option.value);
                                  setPaymentModeSearch("");
                                  setPaymentModeOpen(false);
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <label className="label" htmlFor="water-payment-date">Payment date<input id="water-payment-date" className="input mt-1" type="date" value={form.paymentDate} onChange={(event) => updateField("paymentDate", event.target.value)} /></label>
                <label className="label" htmlFor="water-reference">Reference number<input id="water-reference" className="input mt-1" value={form.referenceNumber} onChange={(event) => updateField("referenceNumber", event.target.value)} /></label>
                <label className="label" htmlFor="water-attachment">Attachment URL<input id="water-attachment" className="input mt-1" value={form.attachmentUrl} onChange={(event) => updateField("attachmentUrl", event.target.value)} /></label>
                <label className="label sm:col-span-2" htmlFor="water-remarks">Remarks<textarea id="water-remarks" className="input mt-1 min-h-24 resize-y" value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} /></label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving ? "Saving..." : editingBill ? "Update Bill" : "Save Bill"}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}