import Receipt from "@/models/Receipt";
import { connectDB } from "@/lib/mongodb";
import { generateReceiptNumber } from "@/lib/numbering/receiptNumber";

export async function createReceipt({
  payment,
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