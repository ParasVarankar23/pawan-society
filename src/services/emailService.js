import { sendBillEmail } from "@/lib/email/billEmail";
import { sendReceiptEmail } from "@/lib/email/receiptEmail";
import { sendReminderEmail } from "@/lib/email/reminderEmail";
import EmailLog from "@/models/EmailLog";
import Payment from "@/models/Payment";

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
    const currentCharges = bill.currentCharges || {};
    const penaltyAmount =
      typeof bill.penalty === "object"
        ? bill.penalty?.amount || 0
        : bill.penalty || 0;

    console.log("[email] bill values forwarded", {
      billNumber: bill.billNumber,
      billingMonth: bill.billingMonth,
      currentCharges,
      penalty: penaltyAmount,
      totalOutstanding: bill.totalOutstanding,
      balanceAmount: bill.balanceAmount,
    });

    const result = await sendBillEmail({
      email: recipient,
      memberName:
        bill.memberId?.name ||
        bill.memberName ||
        "Member",
      roomNumber:
        bill.roomId?.roomNumber ||
        bill.roomNumber ||
        "",
      billNumber: bill.billNumber,
      billingMonth: bill.billingMonth,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      previousOutstanding: bill.previousOutstanding,
      currentCharges,
      penalty: penaltyAmount,
      totalOutstanding: bill.totalOutstanding,
      balanceAmount: bill.balanceAmount,
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
    console.error("Receipt email delivery failed:", error);

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
    let billingMonth = receipt.billingMonth || "";

    if (!billingMonth && receipt.paymentId) {
      const payment = await Payment.findById(receipt.paymentId)
        .populate("billId", "billingMonth")
        .lean();
      billingMonth = payment?.billId?.billingMonth || "";
    }

    const result = await sendReceiptEmail({
      email: recipient,
      memberName:
        receipt.memberId?.name ||
        receipt.memberName ||
        "Member",
      receiptNumber:
        receipt.receiptNumber,
      amount: receipt.amount,
      paymentMode:
        receipt.paymentMode,
      billingMonth,
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