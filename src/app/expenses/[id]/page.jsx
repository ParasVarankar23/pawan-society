"use client";

import {
    ArrowLeft,
    ExternalLink,
    FileText,
    Pencil,
    Receipt,
    WalletCards
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Toast from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function DetailItem({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
                {value || "-"}
            </p>
        </div>
    );
}

export default function ExpenseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadExpense() {
            if (!params.id) return;

            try {
                const result = await api.get(`/expenses/${params.id}`);
                setExpense(result.data);
            } catch (requestError) {
                setError(requestError.message || "Unable to load expense.");
            } finally {
                setLoading(false);
            }
        }

        loadExpense();
    }, [params.id]);

    return (
        <AppShell>
            <Toast message={error} onClose={() => setError("")} />

            <div className="mx-auto max-w-4xl space-y-6">
                <button
                    type="button"
                    onClick={() => router.push("/expenses")}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950"
                >
                    <ArrowLeft size={16} />
                    Back to Expenses
                </button>

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
                        <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
                    </div>
                ) : !expense ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <WalletCards size={42} className="mx-auto text-slate-300" />
                        <h1 className="mt-4 text-lg font-bold text-slate-900">Expense not found</h1>
                        <p className="mt-1 text-sm text-slate-500">This expense may have been removed.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Finance
                                </p>
                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                    Expense Details
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    {expense.description || "Society expense"}
                                </p>
                            </div>

                            
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                        <Receipt size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {expense.category?.name || "Other"}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {expense.vendorName || "No vendor specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Expense amount
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-red-600">
                                        {formatCurrency(expense.amount)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <DetailItem label="Expense date" value={formatDate(expense.date)} />
                                <DetailItem label="Bill number" value={expense.billNumber} />
                                <DetailItem label="Status" value={expense.status} />
                                <DetailItem label="Payment mode" value={expense.paymentMode?.replaceAll("_", " ")} />
                                <DetailItem label="Payment date" value={formatDate(expense.paymentDate)} />
                                <DetailItem label="Reference number" value={expense.referenceNumber} />
                            </div>

                            <div className="mt-5 rounded-xl border border-slate-100 p-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <FileText size={17} className="text-slate-500" />
                                    Description
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {expense.description || "-"}
                                </p>
                            </div>

                            {expense.attachmentUrl && (
                                <a
                                    href={expense.attachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
                                >
                                    <ExternalLink size={16} />
                                    Open attachment
                                </a>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
