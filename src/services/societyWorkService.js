import { connectDB } from "@/lib/mongodb";
import SocietyWork from "@/models/SocietyWork";

export async function createSocietyWork({
  data,
  adminId,
}) {
  await connectDB();

  return SocietyWork.create({
    ...data,
    createdBy: adminId,
  });
}

export async function getSocietyWorks(
  filters = {}
) {
  await connectDB();

  return SocietyWork.find(filters)
    .sort({ startDate: -1 })
    .lean();
}

export async function getSocietyWorkById(id) {
  await connectDB();

  return SocietyWork.findById(id).lean();
}

export async function updateSocietyWork(
  id,
  data
) {
  await connectDB();

  return SocietyWork.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteSocietyWork(id) {
  await connectDB();

  return SocietyWork.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "CANCELLED",
      },
    },
    { new: true }
  );
}