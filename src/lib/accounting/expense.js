import {
  createFinancialTransaction,
} from "./transaction";

export async function recordExpense({
  amount,
  category,
  description,
  referenceType = "",
  referenceId = null,
  paymentMode = "",
  createdBy,
}) {
  return createFinancialTransaction({
    type: "EXPENSE",
    category,
    amount,
    description,
    referenceType,
    referenceId,
    paymentMode,
    createdBy,
  });
}