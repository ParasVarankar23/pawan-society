import AuditLog from "@/models/AuditLog";
import { connectDB } from "@/lib/mongodb";

export async function createAuditLog({
  userId,
  action,
  module,
  recordId,
  oldData,
  newData,
  description,
  ipAddress,
  userAgent,
}) {
  await connectDB();

  return AuditLog.create({
    userId,
    action,
    module,
    recordId,
    oldData,
    newData,
    description,
    ipAddress,
    userAgent,
  });
}

export async function getAuditLogs({
  module,
  action,
  recordId,
  startDate,
  endDate,
} = {}) {
  await connectDB();

  const query = {};

  if (module) query.module = module;
  if (action) query.action = action;
  if (recordId) query.recordId = recordId;

  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.createdAt.$lte = end;
    }
  }

  return AuditLog.find(query)
    .populate("userId")
    .sort({ createdAt: -1 })
    .lean();
}