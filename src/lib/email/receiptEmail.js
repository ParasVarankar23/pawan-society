import { sendEmail } from "./transporter";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatBillingMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));

  if (!match) return "Maintenance payment";

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
}

export async function sendReceiptEmail({
  email,
  memberName,
  receiptNumber,
  amount,
  paymentMode,
  billingMonth,
  pdfPath,
}) {
  const attachments = [];

  if (pdfPath) {
    attachments.push({
      filename:
        `Pawan-Society-Receipt-${receiptNumber}.pdf`,
      path: pdfPath,
    });
  }

  return sendEmail({
    to: email,

    subject:
      `Pawan Society - Payment Receipt ${receiptNumber}`,

    text:
      `Dear ${memberName}, payment of ₹${amount} for ` +
      `${formatBillingMonth(billingMonth)} has been received. ` +
      `Receipt No: ${receiptNumber}.`,

    html: `
      <div style="margin:0;background:#f4f7fb;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:#172033;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="background:#0b74de;padding:24px;color:#ffffff;">
            <div style="font-size:12px;font-weight:bold;letter-spacing:1px;opacity:.85;">PAWAN SOCIETY</div>
            <h1 style="margin:8px 0 0;font-size:26px;">Payment Receipt</h1>
            <p style="margin:6px 0 0;font-size:14px;opacity:.9;">Your maintenance payment has been recorded.</p>
          </div>

          <div style="padding:26px 24px;">
            <p style="margin:0 0 20px;font-size:15px;">Dear <strong>${escapeHtml(memberName)}</strong>,</p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;">
              <tr>
                <td style="padding:13px 14px;color:#64748b;border-bottom:1px solid #edf0f5;">Receipt No.</td>
                <td style="padding:13px 14px;text-align:right;font-weight:bold;border-bottom:1px solid #edf0f5;">${escapeHtml(receiptNumber)}</td>
              </tr>
              <tr>
                <td style="padding:13px 14px;color:#64748b;border-bottom:1px solid #edf0f5;">Maintenance Month</td>
                <td style="padding:13px 14px;text-align:right;font-weight:bold;border-bottom:1px solid #edf0f5;">${escapeHtml(formatBillingMonth(billingMonth))}</td>
              </tr>
              <tr>
                <td style="padding:13px 14px;color:#64748b;border-bottom:1px solid #edf0f5;">Payment Mode</td>
                <td style="padding:13px 14px;text-align:right;font-weight:bold;border-bottom:1px solid #edf0f5;">${escapeHtml(paymentMode)}</td>
              </tr>
              <tr>
                <td style="padding:13px 14px;color:#64748b;">Amount Paid</td>
                <td style="padding:13px 14px;text-align:right;color:#047857;font-size:20px;font-weight:bold;white-space:nowrap;">₹${Number(amount || 0).toFixed(2)}</td>
              </tr>
            </table>

            <div style="margin-top:22px;padding:14px 16px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;color:#065f46;font-size:14px;">
              Payment received successfully. Please keep this receipt for your records.
            </div>
          </div>

          <div style="padding:18px 24px;background:#f8fafc;color:#64748b;font-size:12px;">Pawan Society, Sector 7, Khanda Colony, New Panvel</div>
        </div>
      </div>
    `,

    attachments,
  });
}