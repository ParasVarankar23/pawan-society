export function calculateBalance({
  previousBalance = 0,
  debit = 0,
  credit = 0,
}) {
  const previous =
    Number(previousBalance);

  const debitAmount =
    Number(debit);

  const creditAmount =
    Number(credit);

  const balance =
    previous +
    debitAmount -
    creditAmount;

  return Math.round(
    balance * 100
  ) / 100;
}