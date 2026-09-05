export function calculateOutstanding({
  previousOutstanding = 0,
  currentCharges = 0,
  penalty = 0,
  paidAmount = 0,
}) {
  const previous =
    Number(previousOutstanding);

  const current =
    Number(currentCharges);

  const fine =
    Number(penalty);

  const paid =
    Number(paidAmount);

  if (previous < 0) {
    throw new Error(
      "Previous outstanding cannot be negative"
    );
  }

  if (current < 0) {
    throw new Error(
      "Current charges cannot be negative"
    );
  }

  if (fine < 0) {
    throw new Error(
      "Penalty cannot be negative"
    );
  }

  if (paid < 0) {
    throw new Error(
      "Paid amount cannot be negative"
    );
  }

  const total =
    previous +
    current +
    fine;

  const balance =
    Math.max(
      total - paid,
      0
    );

  return {
    previousOutstanding:
      Math.round(previous * 100) / 100,

    currentCharges:
      Math.round(current * 100) / 100,

    penalty:
      Math.round(fine * 100) / 100,

    totalOutstanding:
      Math.round(total * 100) / 100,

    paidAmount:
      Math.round(paid * 100) / 100,

    balanceAmount:
      Math.round(balance * 100) / 100,
  };
}