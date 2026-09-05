"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  IndianRupee,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

const reports = [
  {
    title: "Daily Report",
    description: "View daily income, expenses and transactions.",
    href: "/reports/daily",
    icon: FileBarChart,
  },
  {
    title: "Monthly Report",
    description: "Review monthly collections and expenses.",
    href: "/reports/monthly",
    icon: BarChart3,
  },
  {
    title: "Yearly Report",
    description: "View financial performance for the year.",
    href: "/reports/yearly",
    icon: TrendingUp,
  },
  {
    title: "Income Report",
    description: "Review member payments and society income.",
    href: "/reports/income",
    icon: IndianRupee,
  },
  {
    title: "Expense Report",
    description: "Review society expenses and categories.",
    href: "/reports/expenses",
    icon: TrendingDown,
  },
  {
    title: "Collection Report",
    description: "Track maintenance and other collections.",
    href: "/reports/collection",
    icon: ReceiptText,
  },
  {
    title: "Outstanding Report",
    description: "Review pending member dues.",
    href: "/reports/outstanding",
    icon: Users,
  },
  {
    title: "Cash Book Report",
    description: "Review complete cash book activity.",
    href: "/reports/cashbook",
    icon: BookOpen,
  },
  {
    title: "Audit Report",
    description: "Review accounting and audit information.",
    href: "/reports/audit",
    icon: ClipboardCheck,
  },
];

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Finance & Accounting
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Generate and review society financial reports.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon;

            return (
              <Link
                key={report.href}
                href={report.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    View →
                  </span>
                </div>

                <h2 className="mt-5 font-bold text-slate-900">
                  {report.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {report.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
              <WalletCards size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Centralized Accounting
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Member payments and society expenses are linked with
                the Financial Transaction system, Cash Book and audit
                reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}