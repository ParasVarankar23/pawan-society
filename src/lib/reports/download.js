function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text)
        ? `"${text.replaceAll('"', '""')}"`
        : text;
}

export function downloadCsv(filename, columns, rows) {
    const header = columns.map((column) => escapeCsvValue(column.label));
    const values = rows.map((row) =>
        columns.map((column) => escapeCsvValue(row[column.key]))
    );
    const csv = [header, ...values]
        .map((line) => line.join(","))
        .join("\n");

    downloadBlob(
        new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
        filename
    );
}

export function downloadExcel(filename, columns, rows) {
    const header = columns
        .map((column) => `<th>${column.label}</th>`)
        .join("");
    const body = rows
        .map((row) =>
            `<tr>${columns
                .map((column) => `<td>${String(row[column.key] ?? "")}</td>`)
                .join("")}</tr>`
        )
        .join("");
    const html = `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;

    downloadBlob(
        new Blob([html], { type: "application/vnd.ms-excel" }),
        filename
    );
}

export async function downloadPdf(filename, title, columns, rows) {
    const { jsPDF } = await import("jspdf");
    const document = new jsPDF({ orientation: "landscape" });
    const lines = [
        title,
        "",
        columns.map((column) => column.label).join(" | "),
        ...rows.map((row) =>
            columns.map((column) => String(row[column.key] ?? "")).join(" | ")
        ),
    ];

    document.setFontSize(15);
    document.text(title, 14, 16);
    document.setFontSize(8);
    document.text(
        document.splitTextToSize(lines.slice(2).join("\n"), 270),
        14,
        26
    );
    document.save(filename);
}
