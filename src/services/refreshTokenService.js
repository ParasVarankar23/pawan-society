import RefreshSession from "@/models/RefreshSession";
import { connectDB } from "@/lib/mongodb";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import { hashToken } from "@/services/tokenService";

export async function refreshAccessToken({
  refreshToken,
  userAgent,
  ipAddress,
}) {
  await connectDB();

  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const tokenHash = hashToken(refreshToken);

  const session = await RefreshSession.findOne({
    tokenHash,
    status: "ACTIVE",
  }).select("+tokenHash +replacedByTokenHash");

  if (!session) {
    throw new Error("Invalid refresh session");
  }

  if (session.expiresAt < new Date()) {
    session.status = "EXPIRED";
    await session.save();

    throw new Error("Refresh token expired");
  }

  const accessToken = await createAccessToken({
    sub: session.adminId.toString(),
  });

  const newRefreshToken = await createRefreshToken({
    sub: session.adminId.toString(),
  });

  const newHash = hashToken(newRefreshToken);

  session.status = "REVOKED";
  session.revokedAt = new Date();
  session.replacedByTokenHash = newHash;

  await session.save();

  await RefreshSession.create({
    adminId: session.adminId,
    tokenHash: newHash,
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "ACTIVE",
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function revokeRefreshToken(refreshToken) {
  await connectDB();

  if (!refreshToken) return;

  const tokenHash = hashToken(refreshToken);

  await RefreshSession.updateOne(
    {
      tokenHash,
      status: "ACTIVE",
    },
    {
      $set: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    }
  );
}

export async function revokeAllAdminSessions(adminId) {
  await connectDB();

  await RefreshSession.updateMany(
    {
      adminId,
      status: "ACTIVE",
    },
    {
      $set: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    }
  );
}