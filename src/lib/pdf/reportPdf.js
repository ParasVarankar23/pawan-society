export async function generateReportPdfData({
  title,
  rows = [],
  summary = {},
}) {
  return {
    title,
    rows,
    summary,
    generatedAt: new Date(),
  };
}