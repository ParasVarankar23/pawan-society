import Bill from "@/models/Bill";
import Member from "@/models/Member";
import Payment from "@/models/Payment";
import Receipt from "@/models/Receipt";

import { createLedgerEntry } from "@/lib/accounting/ledger";
import { createFinancialTransaction } from "@/lib/accounting/transaction";
import { connectDB } from "@/lib/mongodb";
import { sendReceipt } from "@/services/emailService";
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

  let bill = null;

  if (data.billId) {
    bill = await Bill.findById(data.billId);

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
    billingMonth: bill?.billingMonth || "",
  });

  await Receipt.findByIdAndUpdate(
    receipt._id,
    { $set: { emailStatus: "PENDING" } }
  );

  const member = await Member.findById(
    payment.memberId
  ).lean();

  if (!member?.email) {
    await Receipt.findByIdAndUpdate(
      receipt._id,
      { $set: { emailStatus: "NOT_SENT" } }
    );
  } else {
    try {
      await sendReceipt({
        receipt: {
          ...receipt.toObject(),
          memberId: member,
        },
        recipient: member.email,
      });

      await Receipt.findByIdAndUpdate(
        receipt._id,
        {
          $set: {
            emailStatus: "SENT",
            emailSentAt: new Date(),
          },
        }
      );
    } catch (error) {
      console.error(
        `Receipt email failed for receipt ${receipt.receiptNumber}:`,
        error
      );

      await Receipt.findByIdAndUpdate(
        receipt._id,
        { $set: { emailStatus: "FAILED" } }
      );
    }
  }

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