export const TRANSACTION_TYPES = Object.freeze({
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
});

export const TRANSACTION_TYPE_LABELS = Object.freeze({
  INCOME: "Income",
  EXPENSE: "Expense",
});

export function isValidTransactionType(type) {
  return Object.values(TRANSACTION_TYPES).includes(type);
}