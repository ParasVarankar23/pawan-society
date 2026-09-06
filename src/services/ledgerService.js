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

export async function getLedgerEntries({
  transactionType,
  fromDate,
  toDate,
} = {}) {
  await connectDB();

  const query = {};

  if (transactionType) {
    query.transactionType = transactionType;
  }

  if (fromDate || toDate) {
    query.date = {};

    if (fromDate) {
      query.date.$gte = new Date(`${fromDate}T00:00:00`);
    }

    if (toDate) {
      query.date.$lte = new Date(`${toDate}T23:59:59.999`);
    }
  }

  return LedgerEntry.find(query)
    .populate("roomId")
    .populate("memberId")
    .sort({ date: -1, createdAt: -1 })
    .lean();
}