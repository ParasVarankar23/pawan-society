export function calculateWaterUnits(
  previousReading,
  currentReading
) {
  const previous = Number(previousReading);
  const current = Number(currentReading);

  if (!Number.isFinite(previous)) {
    throw new Error(
      "Invalid previous water reading"
    );
  }

  if (!Number.isFinite(current)) {
    throw new Error(
      "Invalid current water reading"
    );
  }

  if (previous < 0 || current < 0) {
    throw new Error(
      "Water readings cannot be negative"
    );
  }

  if (current < previous) {
    throw new Error(
      "Current reading cannot be less than previous reading"
    );
  }

  return current - previous;
}

export function calculateWaterAmount({
  previousReading,
  currentReading,
  ratePerUnit,
}) {
  const units = calculateWaterUnits(
    previousReading,
    currentReading
  );

  const rate = Number(ratePerUnit);

  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error(
      "Invalid water rate"
    );
  }

  const amount =
    units * rate;

  return {
    previousReading:
      Number(previousReading),

    currentReading:
      Number(currentReading),

    units,

    ratePerUnit: rate,

    amount: Math.round(
      amount * 100
    ) / 100,
  };
}