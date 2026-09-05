"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileSearch,
  ImagePlus,
  Loader2,
  ScanText,
  Settings,
  Sparkles,
} from "lucide-react";

export default function AIPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch("/api/ai/status", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error("Failed to load AI status:", error);
    } finally {
      setLoading(false);
    }
  };

  const processDocument = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ai/ocr", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to process document."
        );
      }

      setResult(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const enabled =
    status?.enabled ??
    status?.available ??
    false;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <Sparkles size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                AI Assistant
              </h1>

              <p className="text-sm text-slate-500">
                Optional document OCR and data extraction
              </p>
            </div>
          </div>

          <Link
            href="/settings/ai"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Settings size={17} />
            AI Settings
          </Link>
        </div>

        {/* Status */}
        <div
          className={`rounded-2xl border p-5 ${
            enabled
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                enabled
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {enabled ? (
                <CheckCircle2 size={22} />
              ) : (
                <AlertCircle size={22} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                {loading
                  ? "Checking AI status..."
                  : enabled
                  ? "AI OCR is enabled"
                  : "AI OCR is currently disabled"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {enabled
                  ? "You can upload supported documents and extract structured information."
                  : "The society management system works normally without AI. Configure Gemini only if OCR functionality is required."}
              </p>
            </div>
          </div>
        </div>

        {/* OCR */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ScanText size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Document OCR
                </h2>

                <p className="text-sm text-slate-500">
                  Extract information from bills and documents.
                </p>
              </div>
            </div>

            <label className="mt-6 flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-violet-400 hover:bg-violet-50/30">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setResult(null);
                  setError("");
                }}
              />

              {file ? (
                <>
                  <FileSearch
                    size={42}
                    className="text-violet-500"
                  />

                  <p className="mt-4 font-bold text-slate-800">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <ImagePlus
                    size={42}
                    className="text-slate-300"
                  />

                  <p className="mt-4 font-bold text-slate-700">
                    Upload document
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    PDF, JPG, PNG or other supported image
                  </p>
                </>
              )}
            </label>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={processDocument}
              disabled={!file || processing || !enabled}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <ScanText size={18} />
                  Extract Information
                </>
              )}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-bold text-slate-900">
              Extracted Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              OCR results will appear here for verification.
            </p>

            {!result ? (
              <div className="flex min-h-[280px] items-center justify-center text-center">
                <div>
                  <FileSearch
                    size={42}
                    className="mx-auto text-slate-200"
                  />

                  <p className="mt-3 font-semibold text-slate-500">
                    No result yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Upload a document to begin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <ResultField
                  label="Document Type"
                  value={result.documentType}
                />

                <ResultField
                  label="Confidence"
                  value={
                    result.confidence !== undefined
                      ? `${Math.round(
                          Number(result.confidence) * 100
                        )}%`
                      : "-"
                  }
                />

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Extracted Data
                  </p>

                  <pre className="max-h-[360px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    {JSON.stringify(
                      result.extractedData ||
                        result.data ||
                        result,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI notice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">
            AI is optional
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Billing calculations, maintenance charges, water
            calculations, penalties, payments, receipts, ledger,
            accounting and reports do not depend on the AI service.
            AI is only an additional tool for document processing.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultField({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}