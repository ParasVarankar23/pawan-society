import { sendEmail } from "./transporter";

export async function sendReceiptEmail({
  email,
  memberName,
  receiptNumber,
  amount,
  paymentMode,
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
      `Dear ${memberName}, payment of ₹${amount} ` +
      `has been received. Receipt No: ${receiptNumber}.`,

    html: `
      <div style="font-family:Arial,sans-serif;">
        <h2>Pawan Society</h2>

        <p>
          Dear ${memberName},
        </p>

        <p>
          Your payment has been recorded successfully.
        </p>

        <p>
          <strong>Receipt No:</strong>
          ${receiptNumber}
        </p>

        <p>
          <strong>Amount:</strong>
          ₹${amount}
        </p>

        <p>
          <strong>Payment Mode:</strong>
          ${paymentMode}
        </p>

        <p>
          Please find the receipt attached.
        </p>
      </div>
    `,

    attachments,
  });
}