"use client";

import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

const emptyForm = {
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

function dateValue(value) {
    return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function formFromWork(work) {
    return {
        workName: work.workName || "",
        category: work.category || "",
        vendorName: work.vendorName || "",
        description: work.description || "",
        startDate: dateValue(work.startDate),
        completionDate: dateValue(work.completionDate),
        estimatedCost: work.estimatedCost ?? "",
        actualCost: work.actualCost ?? "",
        billNumber: work.billNumber || "",
        paymentStatus: work.paymentStatus || "UNPAID",
        paymentMode: work.paymentMode || "",
        paymentDate: dateValue(work.paymentDate),
        referenceNumber: work.referenceNumber || "",
        status: work.status || "PLANNED",
    };
}

export default function SocietyWorkDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [statusSearch, setStatusSearch] = useState("");
    const [statusOpen, setStatusOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [workResult, categoryResult] = await Promise.all([
                    api.get(`/works/${id}`),
                    api.get("/works/categories"),
                ]);
                setForm(formFromWork(workResult.data));
                const data = Array.isArray(categoryResult.data)
                    ? categoryResult.data
                    : categoryResult.data?.categories || [];
                setCategories(data);
            } catch (err) {
                setError(err.message || "Unable to load society work.");
            } finally {
                setLoading(false);
            }
        }

        if (id) load();
    }, [id]);

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    const filteredCategories = categories.filter((category) => {
        const label = typeof category === "string"
            ? category
            : category.label || category.name || category.value || "";

        return label.toLowerCase().includes(categorySearch.trim().toLowerCase());
    });

    async function save(event) {
        event.preventDefault();
        setError("");

        if (!form.workName.trim() || !form.category) {
            setError("Please enter a work name and select a category.");
            return;
        }

        setSaving(true);

        try {
            await api.put(`/works/${id}`, {
                ...form,
                workName: form.workName.trim(),
                vendorName: form.vendorName.trim(),
                description: form.description.trim(),
                estimatedCost: Number(form.estimatedCost || 0),
                actualCost: Number(form.actualCost || 0),
                startDate: form.startDate || null,
                completionDate: form.completionDate || null,
                paymentDate: form.paymentDate || null,
            });
            setError("");
        } catch (err) {
            setError(err.message || "Unable to update society work.");
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!window.confirm("Cancel this society work?")) return;

        setDeleting(true);
        try {
            await api.delete(`/works/${id}`);
            router.push("/works");
        } catch (err) {
            setError(err.message || "Unable to cancel society work.");
            setDeleting(false);
        }
    }

    return (
        <AppShell>
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            <div className="mx-auto max-w-5xl space-y-6">
                <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
                    <ArrowLeft size={16} /> Back to Works
                </button>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Society Operations</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Edit Society Work</h1>
                    <p className="mt-1 text-sm text-slate-500">Update project details, schedule, cost, and payment information.</p>
                </div>

                <form onSubmit={save} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <section>
                        <h2 className="font-bold text-slate-900">Work details</h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-2">
                            <Field label="Work name" value={form.workName} onChange={(value) => updateField("workName", value)} required />
                            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700"><span>Category</span>
                                <div className="relative">
                                    <button type="button" className="input flex w-full items-center justify-between text-left" onClick={() => setCategoryOpen((open) => !open)} disabled={loading} aria-haspopup="listbox" aria-expanded={categoryOpen}>
                                        <span className={form.category ? "text-slate-800" : "text-slate-400"}>{form.category || "Select category"}</span>
                                        <span className="text-slate-400">▾</span>
                                    </button>
                                    {categoryOpen && (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                                            <input className="input" value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder="Search category..." aria-label="Search work categories" />
                                            <div className="mt-2 max-h-56 overflow-y-auto">
                                                <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50" onClick={() => { updateField("category", ""); setCategoryOpen(false); }}>Select category</button>
                                                {filteredCategories.map((category) => {
                                                    const value = typeof category === "string" ? category : category.value || category.name;
                                                    const label = typeof category === "string" ? category : category.label || category.name || value;
                                                    return <button key={value} type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100" onClick={() => { updateField("category", value); setCategorySearch(""); setCategoryOpen(false); }}>{label}</button>;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                            <Field label="Vendor" value={form.vendorName} onChange={(value) => updateField("vendorName", value)} />
                            <StatusPicker value={form.status} search={statusSearch} open={statusOpen} setSearch={setStatusSearch} setOpen={setStatusOpen} onChange={(value) => updateField("status", value)} />
                            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 sm:col-span-2"><span>Description</span>
                                <textarea className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-400" rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
                            </label>
                        </div>
                    </section>

                    <section className="border-t border-slate-100 pt-6">
                        <h2 className="font-bold text-slate-900">Schedule and cost</h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <Field label="Start date" type="date" value={form.startDate} onChange={(value) => updateField("startDate", value)} />
                            <Field label="Completion date" type="date" value={form.completionDate} onChange={(value) => updateField("completionDate", value)} />
                            <Field label="Estimated cost" type="number" value={form.estimatedCost} onChange={(value) => updateField("estimatedCost", value)} />
                            <Field label="Actual cost" type="number" value={form.actualCost} onChange={(value) => updateField("actualCost", value)} />
                        </div>
                    </section>

                    <section className="border-t border-slate-100 pt-6">
                        <h2 className="font-bold text-slate-900">Payment details</h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <Field label="Bill number" value={form.billNumber} onChange={(value) => updateField("billNumber", value)} />
                            <SelectField label="Payment status" value={form.paymentStatus} onChange={(value) => updateField("paymentStatus", value)} options={[["UNPAID", "Unpaid"], ["PARTIAL", "Partial"], ["PAID", "Paid"]]} />
                            <Field label="Payment mode" value={form.paymentMode} onChange={(value) => updateField("paymentMode", value)} />
                            <Field label="Payment date" type="date" value={form.paymentDate} onChange={(value) => updateField("paymentDate", value)} />
                            <Field label="Reference number" value={form.referenceNumber} onChange={(value) => updateField("referenceNumber", value)} className="sm:col-span-2 lg:col-span-4" />
                        </div>
                    </section>

                    <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
                        <button type="button" onClick={remove} disabled={deleting || loading} className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} />{deleting ? "Cancelling..." : "Cancel Work"}</button>
                        <button type="submit" disabled={saving || loading} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-50"><Save size={16} />{saving ? "Saving..." : "Save Changes"}</button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}

function Field({ label, value, onChange, type = "text", required = false, className = "" }) {
    return (
        <label className={`space-y-2 text-sm font-semibold text-slate-700 ${className}`}>
            {label}
            <input className="input" type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
        </label>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <label className="space-y-2 text-sm font-semibold text-slate-700">
            {label}
            <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
            </select>
        </label>
    );
}

function StatusPicker({ value, search, open, setSearch, setOpen, onChange }) {
    const options = [["PLANNED", "Planned"], ["IN_PROGRESS", "In Progress"], ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"]].filter(([, label]) => label.toLowerCase().includes(search.trim().toLowerCase()));
    const label = { PLANNED: "Planned", IN_PROGRESS: "In Progress", COMPLETED: "Completed", CANCELLED: "Cancelled" }[value] || "Planned";

    return (
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700"><span>Status</span>
            <div className="relative">
                <button type="button" className="input flex w-full items-center justify-between text-left" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
                    <span>{label}</span><span className="text-slate-400">▾</span>
                </button>
                {open && <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search status..." aria-label="Search work status" />
                    <div className="mt-2 max-h-40 overflow-y-auto">
                        {options.map(([optionValue, optionLabel]) => <button key={optionValue} type="button" className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 ${value === optionValue ? "bg-slate-50 font-semibold" : ""}`} onClick={() => { onChange(optionValue); setSearch(""); setOpen(false); }}>{optionLabel}</button>)}
                    </div>
                </div>}
            </div>
        </label>
    );
}
