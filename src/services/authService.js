import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import RefreshSession from "@/models/RefreshSession";
import { connectDB } from "@/lib/mongodb";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { hashToken } from "@/lib/token";

export async function loginAdmin({ email, password, userAgent, ipAddress }) {
  await connectDB();

  const admin = await Admin.findOne({
    email: email.toLowerCase().trim(),
    status: "ACTIVE",
  }).select("+passwordHash");

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = await createAccessToken({
    sub: admin._id.toString(),
    email: admin.email,
  });

  const refreshToken = await createRefreshToken({
    sub: admin._id.toString(),
  });

  const tokenHash = hashToken(refreshToken);

  await RefreshSession.create({
    adminId: admin._id,
    tokenHash,
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "ACTIVE",
  });

  return {
    admin: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
    },
    accessToken,
    refreshToken,
  };
}