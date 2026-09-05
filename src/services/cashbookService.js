import FinancialTransaction from "@/models/FinancialTransaction";
import { connectDB } from "@/lib/mongodb";

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

    return {
      srNo: index + 1,
      date: transaction.transactionDate,
      particular: transaction.description,
      income,
      expense,
      balance,
      transactionId: transaction._id,
    };
  });
}