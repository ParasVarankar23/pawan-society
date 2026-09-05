import bcrypt from "bcryptjs";
import PasswordResetOtp from "@/models/PasswordResetOtp";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";
import { revokeAllAdminSessions } from "@/services/refreshTokenService";

export async function resetPassword({
  email,
  otpId,
  newPassword,
}) {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await PasswordResetOtp.findOne({
    _id: otpId,
    email: normalizedEmail,
    status: "VERIFIED",
  });

  if (!otpRecord) {
    throw new Error("OTP verification required");
  }

  const admin = await Admin.findOne({
    email: normalizedEmail,
    status: "ACTIVE",
  }).select("+passwordHash");

  if (!admin) {
    throw new Error("Admin account not found");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  admin.passwordHash = passwordHash;
  admin.passwordChangedAt = new Date();

  await admin.save();

  otpRecord.status = "USED";
  otpRecord.usedAt = new Date();

  await otpRecord.save();

  await revokeAllAdminSessions(admin._id);

  return {
    success: true,
  };
}