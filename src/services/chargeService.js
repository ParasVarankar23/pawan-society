import ChargeMaster from "@/models/ChargeMaster";
import { connectDB } from "@/lib/mongodb";

export async function getCurrentCharges() {
  await connectDB();

  const today = new Date();

  return ChargeMaster.findOne({
    status: "ACTIVE",
    effectiveFrom: { $lte: today },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gte: today } },
    ],
  })
    .sort({ effectiveFrom: -1 })
    .lean();
}

export async function createCharge(data) {
  await connectDB();

  return ChargeMaster.create(data);
}

export async function updateCharge(id, data) {
  await connectDB();

  return ChargeMaster.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function getChargeHistory() {
  await connectDB();

  return ChargeMaster.find()
    .sort({ effectiveFrom: -1 })
    .lean();
}