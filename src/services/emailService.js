import { sendBillEmail } from "@/lib/email/billEmail";
import { sendReceiptEmail } from "@/lib/email/receiptEmail";
import { sendReminderEmail } from "@/lib/email/reminderEmail";
import EmailLog from "@/models/EmailLog";

import { connectDB } from "@/lib/mongodb";

async function logEmail({
  recipient,
  type,
  reference,
  subject,
  status,
  errorMessage,
}) {
  await connectDB();

  return EmailLog.create({
    recipient,
    type,
    reference,
    subject,
    status,
    sentAt:
      status === "SENT"
        ? new Date()
        : undefined,
    errorMessage,
  });
}

export async function sendBill({
  bill,
  recipient,
  pdfPath,
}) {
  try {
    const result = await sendBillEmail({
      bill,
      recipient,
      pdfPath,
    });

    await logEmail({
      recipient,
      type: "BILL",
      reference: bill._id,
      subject: `Maintenance Bill #${bill.billNumber}`,
      status: "SENT",
    });

    return result;
  } catch (error) {
    await logEmail({
      recipient,
      type: "BILL",
      reference: bill._id,
      subject: `Maintenance Bill #${bill.billNumber}`,
      status: "FAILED",
      errorMessage: error.message,
    });

    throw error;
  }
}

export async function sendReceipt({
  receipt,
  recipient,
  pdfPath,
}) {
  try {
    const result = await sendReceiptEmail({
      receipt,
      recipient,
      pdfPath,
    });

    await logEmail({
      recipient,
      type: "RECEIPT",
      reference: receipt._id,
      subject: `Payment Receipt #${receipt.receiptNumber}`,
      status: "SENT",
    });

    return result;
  } catch (error) {
    await logEmail({
      recipient,
      type: "RECEIPT",
      reference: receipt._id,
      subject: `Payment Receipt #${receipt.receiptNumber}`,
      status: "FAILED",
      errorMessage: error.message,
    });

    throw error;
  }
}

export async function sendReminder({
  recipient,
  data,
}) {
  try {
    const result =
      await sendReminderEmail({
        recipient,
        data,
      });

    await logEmail({
      recipient,
      type: "REMINDER",
      reference: data?.memberId,
      subject: "Maintenance Payment Reminder",
      status: "SENT",
    });

    return result;
  } catch (error) {
    await logEmail({
      recipient,
      type: "REMINDER",
      reference: data?.memberId,
      subject: "Maintenance Payment Reminder",
      status: "FAILED",
      errorMessage: error.message,
    });

    throw error;
  }
}

export async function getEmailLogs(filters = {}) {
  await connectDB();

  return EmailLog.find(filters)
    .sort({ createdAt: -1 })
    .lean();
}