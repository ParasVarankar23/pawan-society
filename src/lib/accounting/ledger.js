import LedgerEntry from "@/models/LedgerEntry";

export async function createLedgerEntry({
  roomId,
  memberId,
  transactionType,
  referenceType,
  referenceId = null,
  description,
  debit = 0,
  credit = 0,
  balance = 0,
  date = new Date(),
}) {
  return LedgerEntry.create({
    roomId,
    memberId,
    date,
    transactionType,
    referenceType,
    referenceId,
    description,
    debit,
    credit,
    balance,
  });
}