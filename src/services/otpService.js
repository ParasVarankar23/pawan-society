import crypto from "crypto";
import PasswordResetOtp from "@/models/PasswordResetOtp";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";
import { sendOtpEmail } from "@/lib/email/otpEmail";

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export async function createAndSendOtp(email) {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const admin = await Admin.findOne({
    email: normalizedEmail,
    status: "ACTIVE",
  });

  if (!admin) {
    throw new Error("Admin account not found");
  }

  await PasswordResetOtp.updateMany(
    {
      adminId: admin._id,
      status: "ACTIVE",
    },
    {
      $set: {
        status: "EXPIRED",
      },
    }
  );

  const otp = generateOtp();

  await PasswordResetOtp.create({
    adminId: admin._id,
    email: normalizedEmail,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
    maxAttempts: 5,
    status: "ACTIVE",
  });

  await sendOtpEmail({
    to: normalizedEmail,
    otp,
  });

  return {
    success: true,
    expiresInMinutes: 10,
  };
}

export async function verifyOtp({ email, otp }) {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();

  const record = await PasswordResetOtp.findOne({
    email: normalizedEmail,
    status: "ACTIVE",
  }).sort({ createdAt: -1 }).select("+otpHash");

  if (!record) {
    throw new Error("OTP not found or expired");
  }

  if (record.expiresAt < new Date()) {
    record.status = "EXPIRED";
    await record.save();
    throw new Error("OTP has expired");
  }

  if (record.attempts >= record.maxAttempts) {
    record.status = "BLOCKED";
    await record.save();
    throw new Error("Too many OTP attempts");
  }

  const valid = hashOtp(otp) === record.otpHash;

  if (!valid) {
    record.attempts += 1;

    if (record.attempts >= record.maxAttempts) {
      record.status = "BLOCKED";
    }

    await record.save();

    throw new Error("Invalid OTP");
  }

  record.status = "VERIFIED";
  record.verifiedAt = new Date();

  await record.save();

  return {
    success: true,
    otpId: record._id.toString(),
  };
}