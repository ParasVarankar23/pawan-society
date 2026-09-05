import Payment from "@/models/Payment";
import Bill from "@/models/Bill";

import { connectDB } from "@/lib/mongodb";
import { createFinancialTransaction } from "@/lib/accounting/transaction";
import { createLedgerEntry } from "@/lib/accounting/ledger";
import { createReceipt } from "@/services/receiptService";

export async function createPayment({
  data,
  adminId,
}) {
  await connectDB();

  const payment = await Payment.create({
    ...data,
    receivedBy: adminId,
    status: "SUCCESS",
  });

  if (data.billId) {
    const bill = await Bill.findById(data.billId);

    if (!bill) {
      throw new Error("Bill not found");
    }

    bill.paidAmount += data.amount;

    bill.balanceAmount = Math.max(
      0,
      bill.totalOutstanding - bill.paidAmount
    );

    if (bill.balanceAmount === 0) {
      bill.status = "PAID";
    } else {
      bill.status = "PARTIAL";
    }

    await bill.save();
  }

  await createLedgerEntry({
    roomId: data.roomId,
    memberId: data.memberId,
    date: data.paymentDate || new Date(),
    transactionType: "PAYMENT",
    referenceType: "PAYMENT",
    referenceId: payment._id,
    description: "Maintenance payment received",
    debit: 0,
    credit: data.amount,
  });

  await createFinancialTransaction({
    transactionDate: data.paymentDate || new Date(),
    type: "INCOME",
    category: "MAINTENANCE_COLLECTION",
    amount: data.amount,
    description: "Member maintenance payment",
    roomId: data.roomId,
    memberId: data.memberId,
    referenceType: "PAYMENT",
    referenceId: payment._id,
    paymentMode: data.paymentMode,
    createdBy: adminId,
  });

  const receipt = await createReceipt({
    payment,
  });

  return {
    payment,
    receipt,
  };
}

export async function getPayments(filters = {}) {
  await connectDB();

  return Payment.find(filters)
    .populate("roomId")
    .populate("memberId")
    .populate("billId")
    .sort({ paymentDate: -1 })
    .lean();
}