"use client";

import Link from "next/link";
import {
  Bell,
  BrainCircuit,
  Building2,
  Calculator,
  ChevronRight,
  FileCog,
  Mail,
  Percent,
  Settings2,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

const settings = [
  {
    title: "Society Settings",
    description:
      "Manage society name, address, contact details and logo.",
    href: "/settings/society",
    icon: Building2,
  },
  {
    title: "Charges & Rates",
    description:
      "Configure maintenance, sinking fund, insurance, parking and water rates.",
    href: "/settings/charges",
    icon: Calculator,
  },
  {
    title: "Penalty Settings",
    description:
      "Configure penalty rate, grace period and calculation rules.",
    href: "/settings/penalties",
    icon: Percent,
  },
  {
    title: "Numbering Settings",
    description:
      "Configure bill and receipt numbering sequences.",
    href: "/settings/numbering",
    icon: FileCog,
  },
  {
    title: "Email Settings",
    description:
      "Configure email delivery and notification preferences.",
    href: "/settings/email",
    icon: Mail,
  },
  {
    title: "AI / OCR Settings",
    description:
      "Configure optional AI and OCR functionality.",
    href: "/settings/ai",
    icon: BrainCircuit,
  },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Settings2 size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure society, billing, accounting and system preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <Icon size={21} />
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-300 transition group-hover:text-indigo-500"
                  />
                </div>

                <h2 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 text-indigo-600" size={20} />

            <div>
              <h2 className="font-bold text-slate-900">
                Configuration Notice
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Billing rates and penalty rules are stored in the
                database. Do not hard-code financial charges in the
                application or environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}