import { connectDB } from "@/lib/mongodb";
import FinancialTransaction from "@/models/FinancialTransaction";

export async function getCashbook({
  startDate,
  endDate,
} = {}) {
  await connectDB();

  const query = {
    status: "ACTIVE",
  };

  if (startDate || endDate) {
    query.transactionDate = {};

    if (startDate) {
      query.transactionDate.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.transactionDate.$lte = end;
    }
  }

  const transactions = await FinancialTransaction.find(query)
    .populate("memberId", "name")
    .populate("roomId", "roomNumber")
    .sort({
      transactionDate: 1,
      createdAt: 1,
    })
    .lean();

  let balance = 0;

  return transactions.map((transaction, index) => {
    const income =
      transaction.type === "INCOME"
        ? transaction.amount
        : 0;

    const expense =
      transaction.type === "EXPENSE"
        ? transaction.amount
        : 0;

    balance += income - expense;

    const memberName = transaction.memberId?.name;
    const description = memberName
      ? `${transaction.description} - ${memberName}`
      : transaction.description;

    return {
      srNo: index + 1,
      date: transaction.transactionDate,
      description,
      particular: description,
      type: transaction.type,
      amount: transaction.amount,
      income,
      expense,
      balance,
      paymentMode: transaction.paymentMode,
      memberId: transaction.memberId,
      roomId: transaction.roomId,
      transactionId: transaction._id,
    };
  });
}