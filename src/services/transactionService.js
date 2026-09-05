import FinancialTransaction from "@/models/FinancialTransaction";
import { connectDB } from "@/lib/mongodb";

export async function createTransaction(data) {
  await connectDB();

  return FinancialTransaction.create(data);
}

export async function getTransactions(filters = {}) {
  await connectDB();

  return FinancialTransaction.find({
    ...filters,
    status: {
      $ne: "CANCELLED",
    },
  })
    .sort({
      transactionDate: 1,
      createdAt: 1,
    })
    .lean();
}

export async function cancelTransaction(id) {
  await connectDB();

  return FinancialTransaction.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "CANCELLED",
      },
    },
    {
      new: true,
    }
  );
}