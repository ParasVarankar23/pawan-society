import DrinkingWaterBill from "@/models/DrinkingWaterBill";
import { connectDB } from "@/lib/mongodb";

export async function createDrinkingWaterBill({
  data,
  adminId,
}) {
  await connectDB();

  return DrinkingWaterBill.create({
    ...data,
    createdBy: adminId,
  });
}

export async function getDrinkingWaterBills(
  filters = {}
) {
  await connectDB();

  return DrinkingWaterBill.find(filters)
    .sort({ billDate: -1 })
    .lean();
}

export async function updateDrinkingWaterBill(
  id,
  data
) {
  await connectDB();

  return DrinkingWaterBill.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}