import { sendEmail } from "./transporter";

export async function sendReminderEmail({
  email,
  memberName,
  billNumber,
  outstandingAmount,
  dueDate,
}) {
  return sendEmail({
    to: email,

    subject:
      `Pawan Society - Outstanding Maintenance Reminder`,

    text:
      `Dear ${memberName}, your outstanding amount ` +
      `is ₹${outstandingAmount}. Bill No: ${billNumber}.`,

    html: `
      <div style="font-family:Arial,sans-serif;">
        <h2>Pawan Society</h2>

        <p>
          Dear ${memberName},
        </p>

        <p>
          This is a reminder regarding your
          outstanding maintenance amount.
        </p>

        <p>
          <strong>Bill No:</strong>
          ${billNumber}
        </p>

        <p>
          <strong>Outstanding:</strong>
          ₹${outstandingAmount}
        </p>

        <p>
          <strong>Due Date:</strong>
          ${dueDate || "As per bill"}
        </p>
      </div>
    `,
  });
}