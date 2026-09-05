import {
  calculateWaterAmount,
} from "./water";

import {
  calculatePenalty,
} from "./penalty";

import {
  calculateOutstanding,
} from "./outstanding";

function money(value) {
  return Math.round(
    Number(value || 0) * 100
  ) / 100;
}

export function calculateCurrentCharges(
  charges = {}
) {
  const result = {
    maintenance: money(
      charges.maintenance
    ),

    sinkingFund: money(
      charges.sinkingFund
    ),

    insurance: money(
      charges.insurance
    ),

    educationFund: money(
      charges.educationFund
    ),

    parking: money(
      charges.parking
    ),

    nonOccupancy: money(
      charges.nonOccupancy
    ),

    rentNoc: money(
      charges.rentNoc
    ),

    water: money(
      charges.water
    ),

    other: money(
      charges.other
    ),
  };

  const total =
    Object.values(result).reduce(
      (sum, value) =>
        sum + value,
      0
    );

  return {
    ...result,
    total: money(total),
  };
}

export function calculateMonthlyBill({
  previousOutstanding = 0,

  charges = {},

  water = null,

  penalty = null,

  paidAmount = 0,
}) {
  let waterAmount = 0;

  let waterDetails = null;

  if (water) {
    waterDetails =
      calculateWaterAmount(water);

    waterAmount =
      waterDetails.amount;
  }

  const currentCharges =
    calculateCurrentCharges({
      ...charges,
      water: waterAmount,
    });

  let penaltyAmount = 0;

  let penaltyDetails = null;

  if (penalty?.enabled) {
    const penaltyBase =
      penalty.amount !== undefined
        ? penalty.amount
        : previousOutstanding;

    penaltyAmount =
      calculatePenalty({
        amount: penaltyBase,
        rate: penalty.rate,
        rateType:
          penalty.rateType,
      });

    penaltyDetails = {
      amount: penaltyAmount,
      rate: penalty.rate,
      rateType:
        penalty.rateType,
      calculationType:
        penalty.calculationType ||
        "ON_OUTSTANDING",
    };
  }

  const outstanding =
    calculateOutstanding({
      previousOutstanding,
      currentCharges:
        currentCharges.total,
      penalty:
        penaltyAmount,
      paidAmount,
    });

  return {
    currentCharges,
    water: waterDetails,
    penalty: penaltyDetails,
    ...outstanding,
  };
}