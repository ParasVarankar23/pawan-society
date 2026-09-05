import FinancialTransaction from "@/models/FinancialTransaction";

export async function getCashBook({
  startDate,
  endDate,
}) {
  const filter = {
    status: "ACTIVE",
  };

  if (startDate || endDate) {
    filter.transactionDate = {};

    if (startDate) {
      filter.transactionDate.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      filter.transactionDate.$lte = end;
    }
  }

  const transactions =
    await FinancialTransaction.find(filter)
      .sort({
        transactionDate: 1,
        createdAt: 1,
      })
      .lean();

  let balance = 0;

  return transactions.map(
    (transaction, index) => {
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
        jama: income,
        kharch: expense,
        balance,
        transactionId: transaction._id,
      };
    }
  );
}