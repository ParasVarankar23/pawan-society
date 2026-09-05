export function calculatePenalty({
  amount,
  rate,
  rateType = "PERCENTAGE",
}) {
  const baseAmount = Number(amount);
  const penaltyRate = Number(rate);

  if (
    !Number.isFinite(baseAmount) ||
    baseAmount < 0
  ) {
    throw new Error(
      "Invalid penalty amount"
    );
  }

  if (
    !Number.isFinite(penaltyRate) ||
    penaltyRate < 0
  ) {
    throw new Error(
      "Invalid penalty rate"
    );
  }

  let penalty = 0;

  switch (rateType) {
    case "PERCENTAGE":
      penalty =
        baseAmount *
        (penaltyRate / 100);
      break;

    case "FIXED_AMOUNT":
      penalty = penaltyRate;
      break;

    default:
      throw new Error(
        "Invalid penalty rate type"
      );
  }

  return Math.round(
    penalty * 100
  ) / 100;
}