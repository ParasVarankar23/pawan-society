import {
  createFinancialTransaction,
} from "./transaction";

export async function recordIncome({
  amount,
  category,
  description,
  roomId = null,
  memberId = null,
  referenceType = "",
  referenceId = null,
  paymentMode = "",
  createdBy,
}) {
  return createFinancialTransaction({
    type: "INCOME",
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