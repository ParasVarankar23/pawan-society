import LedgerEntry from "@/models/LedgerEntry";
import { connectDB } from "@/lib/mongodb";

export async function createLedger(data) {
  await connectDB();

  return LedgerEntry.create(data);
}

export async function getMemberLedger(memberId) {
  await connectDB();

  return LedgerEntry.find({
    memberId,
  })
    .sort({
      date: 1,
      createdAt: 1,
    })
    .lean();
}

export async function getRoomLedger(roomId) {
  await connectDB();

  return LedgerEntry.find({
    roomId,
  })
    .sort({
      date: 1,
      createdAt: 1,
    })
    .lean();
}