import WaterReading from "@/models/WaterReading";
import { connectDB } from "@/lib/mongodb";
import {
  calculateWaterAmount,
  calculateWaterUnits,
} from "@/lib/calculations/water";

export async function calculateReading({
  previousReading,
  currentReading,
  ratePerUnit,
}) {
  const units = calculateWaterUnits(
    previousReading,
    currentReading
  );

  const amount = calculateWaterAmount({
    previousReading,
    currentReading,
    ratePerUnit,
  }).amount;

  return {
    units,
    ratePerUnit,
    amount,
  };
}

export async function createReading(data) {
  await connectDB();

  const calculation = await calculateReading(data);

  return WaterReading.create({
    ...data,
    ...calculation,
  });
}

export async function getReadings({
  roomId,
  billingMonth,
} = {}) {
  await connectDB();

  const query = {};

  if (roomId) query.roomId = roomId;
  if (billingMonth) query.billingMonth = billingMonth;

  return WaterReading.find(query)
    .populate("roomId")
    .populate("memberId")
    .sort({ billingMonth: -1 })
    .lean();
}

export async function updateReading(id, data) {
  await connectDB();

  const calculation = await calculateReading(data);

  return WaterReading.findByIdAndUpdate(
    id,
    {
      $set: {
        ...data,
        ...calculation,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
}