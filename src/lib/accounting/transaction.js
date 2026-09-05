import FinancialTransaction from "@/models/FinancialTransaction";

export async function createFinancialTransaction({
  transactionDate = new Date(),
  type,
  category,
  amount,
  description,
  roomId = null,
  memberId = null,
  referenceType = "",
  referenceId = null,
  paymentMode = "",
  createdBy,
}) {
  if (!type) {
    throw new Error(
      "Transaction type is required"
    );
  }

  if (!createdBy) {
    throw new Error(
      "Created by is required"
    );
  }

  return FinancialTransaction.create({
    transactionDate,
    type,
    category,
    amount,
    description,
    roomId,
    memberId,
    referenceType,
    referenceId,
    paymentMode,
    createdBy,
  });
}