import PenaltyRule from "@/models/PenaltyRule";
import { connectDB } from "@/lib/mongodb";
import { calculatePenalty } from "@/lib/calculations/penalty";

export async function getActivePenaltyRule() {
  await connectDB();

  const today = new Date();

  return PenaltyRule.findOne({
    status: "ACTIVE",
    enabled: true,
    effectiveFrom: { $lte: today },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gte: today } },
    ],
  })
    .sort({ effectiveFrom: -1 })
    .lean();
}

export async function calculateBillPenalty({
  outstanding,
  currentBill,
  rule,
}) {
  if (!rule || !rule.enabled) {
    return 0;
  }

  let baseAmount = outstanding;

  if (rule.calculationType === "ON_CURRENT_BILL") {
    baseAmount = currentBill;
  }

  if (rule.calculationType === "ON_PRINCIPAL") {
    baseAmount = Math.max(
      0,
      outstanding - currentBill
    );
  }

  return calculatePenalty({
    amount: baseAmount,
    rate: rule.rate,
    rateType: rule.rateType,
  });
}

export async function createPenaltyRule(data) {
  await connectDB();

  return PenaltyRule.create(data);
}

export async function updatePenaltyRule(id, data) {
  await connectDB();

  return PenaltyRule.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}