import ElectricityBill from "@/models/ElectricityBill";
import { connectDB } from "@/lib/mongodb";

export async function createElectricityBill({
  data,
  adminId,
}) {
  await connectDB();

  return ElectricityBill.create({
    ...data,
    createdBy: adminId,
  });
}

export async function getElectricityBills(filters = {}) {
  await connectDB();

  return ElectricityBill.find(filters)
    .sort({ billingMonth: -1 })
    .lean();
}

export async function updateElectricityBill(id, data) {
  await connectDB();

  return ElectricityBill.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}