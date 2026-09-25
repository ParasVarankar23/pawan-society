import { connectDB } from "@/lib/mongodb";
import { generateReceiptNumber } from "@/lib/numbering/receiptNumber";
import Receipt from "@/models/Receipt";

export async function createReceipt({
  payment,
  billingMonth = "",
}) {
  await connectDB();

  const receiptNumber =
    await generateReceiptNumber();

  return Receipt.create({
    receiptNumber,
    paymentId: payment._id,
    roomId: payment.roomId,
    memberId: payment.memberId,
    amount: payment.amount,
    receiptDate:
      payment.paymentDate || new Date(),
    paymentMode: payment.paymentMode,
    billingMonth,
    billNumbers: [],
    emailStatus: "PENDING",
  });
}

export async function getReceipts(filters = {}) {
  await connectDB();

  return Receipt.find(filters)
    .populate("roomId")
    .populate("memberId")
    .populate("paymentId")
    .sort({ receiptDate: -1 })
    .lean();
}

export async function getReceiptById(id) {
  await connectDB();

  return Receipt.findById(id)
    .populate("roomId")
    .populate("memberId")
    .populate("paymentId")
    .lean();
}