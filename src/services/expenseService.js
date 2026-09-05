import Expense from "@/models/Expense";
import ExpenseCategory from "@/models/ExpenseCategory";

import { connectDB } from "@/lib/mongodb";
import { createFinancialTransaction } from "@/lib/accounting/transaction";

export async function createExpense({
  data,
  adminId,
}) {
  await connectDB();

  const expense = await Expense.create({
    ...data,
    createdBy: adminId,
  });

  await createFinancialTransaction({
    transactionDate:
      data.paymentDate || data.date || new Date(),
    type: "EXPENSE",
    category: data.category,
    amount: data.amount,
    description:
      data.description || data.vendorName,
    referenceType: "EXPENSE",
    referenceId: expense._id,
    paymentMode: data.paymentMode,
    createdBy: adminId,
  });

  return expense;
}

export async function getExpenses(filters = {}) {
  await connectDB();

  return Expense.find(filters)
    .populate("category")
    .sort({ date: -1 })
    .lean();
}

export async function createExpenseCategory(data) {
  await connectDB();

  return ExpenseCategory.create(data);
}

export async function getExpenseCategories() {
  await connectDB();

  return ExpenseCategory.find({
    status: "ACTIVE",
  })
    .sort({ name: 1 })
    .lean();
}