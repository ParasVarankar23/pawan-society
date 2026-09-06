"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/lib/apiClient";

export default function AISettingsPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await api.get("/ai/status");
        setStatus(response?.data || null);
      } catch {
        setStatus({ enabled: false, unavailable: true });
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  const enabled = status?.enabled === true;

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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <BrainCircuit size={23} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Settings
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              AI / OCR Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage the optional Gemini-powered document extraction service.
            </p>
          </div>
        </div>

        <section
          className={`rounded-2xl border p-5 md:p-6 ${
            enabled
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {enabled ? (
            <CheckCircle2 className="text-emerald-600" size={24} />
          ) : (
            <AlertCircle className="text-amber-600" size={24} />
          )}
          <h2 className="mt-4 font-bold text-slate-900">
            {loading
              ? "Checking AI status..."
              : enabled
              ? "AI OCR is enabled"
              : "AI OCR is disabled"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {enabled
              ? "Documents can be uploaded and processed from the AI Assistant."
              : "Add GEMINI_API_KEY to the server environment to enable document OCR. This service is optional."}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-600" size={21} />
            <h2 className="font-bold text-slate-900">AI Assistant</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            API keys are kept on the server and are never sent to the browser.
            Billing, payments, accounting and reports work without AI.
          </p>
          <Link
            href="/ai"
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-700"
          >
            Open AI Assistant
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
