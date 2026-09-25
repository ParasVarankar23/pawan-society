"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

import {
    downloadCsv,
    downloadExcel,
    downloadPdf,
} from "@/lib/reports/download";

export default function ReportDownloadActions({
    filename,
    title,
    columns,
    rows,
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => downloadPdf(`${filename}.pdf`, title, columns, rows)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
                <FileText size={15} />
                PDF
            </button>
            <button
                type="button"
                onClick={() => downloadCsv(`${filename}.csv`, columns, rows)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
                <Download size={15} />
                CSV
            </button>
            <button
                type="button"
                onClick={() => downloadExcel(`${filename}.xls`, columns, rows)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
                <FileSpreadsheet size={15} />
                Excel
            </button>
        </div>
    );
}
