import {
  calculateWaterAmount,
  calculateWaterUnits,
} from "@/lib/calculations/water";
import { connectDB } from "@/lib/mongodb";
import WaterReading from "@/models/WaterReading";

export async function calculateReading({
  currentReading,
  ratePerUnit,
}) {
  const units = calculateWaterUnits(
    currentReading
  );

  const amount = calculateWaterAmount({
    currentReading,
    ratePerUnit,
  }).amount;

  return {
    previousReading: 0,
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

export async function deleteReading(id) {
  await connectDB();

  return WaterReading.findByIdAndDelete(id);
}