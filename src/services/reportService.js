import FinancialTransaction from "@/models/FinancialTransaction";
import Bill from "@/models/Bill";
import Payment from "@/models/Payment";

import { connectDB } from "@/lib/mongodb";

function dateQuery(startDate, endDate) {
  const query = {};

  if (startDate || endDate) {
    query.$gte = startDate
      ? new Date(startDate)
      : new Date("2000-01-01");

    query.$lte = endDate
      ? new Date(endDate)
      : new Date();
  }

  return query;
}

export async function getIncomeReport({
  startDate,
  endDate,
} = {}) {
  await connectDB();

  const query = {
    type: "INCOME",
    status: "ACTIVE",
  };

  if (startDate || endDate) {
    query.transactionDate =
      dateQuery(startDate, endDate);
  }

  const transactions =
    await FinancialTransaction.find(query)
      .sort({ transactionDate: 1 })
      .lean();

  const total = transactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return {
    total,
    transactions,
  };
}

export async function getExpenseReport({
  startDate,
  endDate,
} = {}) {
  await connectDB();

  const query = {
    type: "EXPENSE",
    status: "ACTIVE",
  };

  if (startDate || endDate) {
    query.transactionDate =
      dateQuery(startDate, endDate);
  }

  const transactions =
    await FinancialTransaction.find(query)
      .sort({ transactionDate: 1 })
      .lean();

  const total = transactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return {
    total,
    transactions,
  };
}

export async function getCollectionReport({
  startDate,
  endDate,
} = {}) {
  await connectDB();

  const query = {
    status: "SUCCESS",
  };

  if (startDate || endDate) {
    query.paymentDate =
      dateQuery(startDate, endDate);
  }

  const payments =
    await Payment.find(query)
      .populate("roomId")
      .populate("memberId")
      .sort({ paymentDate: 1 })
      .lean();

  const total = payments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return {
    total,
    payments,
  };
}

export async function getOutstandingReport() {
  await connectDB();

  const bills = await Bill.find({
    status: {
      $in: ["UNPAID", "PARTIAL", "OVERDUE", "GENERATED"],
    },
    balanceAmount: {
      $gt: 0,
    },
  })
    .populate("roomId")
    .populate("memberId")
    .sort({ billingMonth: 1 })
    .lean();

  const totalOutstanding = bills.reduce(
    (sum, bill) =>
      sum + (bill.balanceAmount || 0),
    0
  );

  return {
    totalOutstanding,
    bills,
  };
}

export async function getMonthlyReport(
  year,
  month
) {
  const startDate = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  const endDate = new Date(
    Number(year),
    Number(month),
    0,
    23,
    59,
    59,
    999
  );

  const [income, expenses, collection] =
    await Promise.all([
      getIncomeReport({
        startDate,
        endDate,
      }),
      getExpenseReport({
        startDate,
        endDate,
      }),
      getCollectionReport({
        startDate,
        endDate,
      }),
    ]);

  return {
    year: Number(year),
    month: Number(month),
    income: income.total,
    expenses: expenses.total,
    collection: collection.total,
    net:
      income.total - expenses.total,
  };
}