"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Server } from "lucide-react";

import AppShell from "@/components/layout/AppShell";

const settings = [
  ["SMTP_HOST", "SMTP server hostname"],
  ["SMTP_PORT", "SMTP server port, usually 465 or 587"],
  ["SMTP_SECURE", "Use true for secure SMTP connections"],
  ["SMTP_USER", "SMTP account username"],
  ["SMTP_PASSWORD", "SMTP account password"],
  ["EMAIL_FROM", "Sender address shown on outgoing emails"],
];

export default function EmailSettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Mail size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Email Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure the SMTP account used for bills, receipts and reminders.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Server size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">SMTP configuration</h2>
                <p className="text-sm text-slate-500">
                  Set these values in the server environment file.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {settings.map(([name, description]) => (
                <div
                  key={name}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <code className="text-sm font-bold text-slate-800">{name}</code>
                  <span className="text-sm text-slate-500 sm:text-right">{description}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6">
            <CheckCircle2 className="text-emerald-600" size={23} />
            <h2 className="mt-4 font-bold text-slate-900">Email delivery</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Email logs are available from the Emails page after messages are sent.
              Passwords and SMTP credentials are never displayed in this screen.
            </p>
            <Link
              href="/emails"
              className="mt-5 inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700"
            >
              View email logs
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
