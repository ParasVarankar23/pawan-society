import Society from "@/models/Society";
import { connectDB } from "@/lib/mongodb";

export async function getSociety() {
  await connectDB();

  return Society.findOne({ status: "ACTIVE" }).lean();
}

export async function createOrUpdateSociety(data) {
  await connectDB();

  return Society.findOneAndUpdate(
    {},
    {
      $set: data,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).lean();
}