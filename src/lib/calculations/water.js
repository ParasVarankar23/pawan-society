export function calculateWaterUnits(currentReading) {
  const current = Number(currentReading);

  if (!Number.isFinite(current)) {
    throw new Error(
      "Invalid current water reading"
    );
  }

  if (current < 0) {
    throw new Error(
      "Water readings cannot be negative"
    );
  }

  return current;
}

export function calculateWaterAmount({
  currentReading,
  ratePerUnit,
}) {
  const units = calculateWaterUnits(currentReading);

  const rate = Number(ratePerUnit);

  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error(
      "Invalid water rate"
    );
  }

  const amount =
    units * rate;

  return {
    currentReading:
      Number(currentReading),

    units,

    ratePerUnit: rate,

    amount: Math.round(
      amount * 100
    ) / 100,
  };
}