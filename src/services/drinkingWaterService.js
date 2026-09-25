import { connectDB } from "@/lib/mongodb";
import DrinkingWaterBill from "@/models/DrinkingWaterBill";

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

  const {
    fromDate,
    toDate,
    ...billFilters
  } = filters;

  if (fromDate || toDate) {
    billFilters.billDate = {};

    if (fromDate) {
      billFilters.billDate.$gte = new Date(`${fromDate}T00:00:00`);
    }

    if (toDate) {
      billFilters.billDate.$lte = new Date(`${toDate}T23:59:59.999`);
    }
  }

  return DrinkingWaterBill.find(billFilters)
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

export async function deleteDrinkingWaterBill(id) {
  await connectDB();

  return DrinkingWaterBill.findByIdAndDelete(id);
}