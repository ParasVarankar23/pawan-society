import { jwtVerify } from "jose";

import {
  getAccessTokenCookie,
} from "./cookies";

function getAccessSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not configured"
    );
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(token) {
  try {
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      getAccessSecret()
    );

    if (payload.type !== "access") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const token = await getAccessTokenCookie();

  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    return null;
  }

  return {
    adminId: payload.adminId,
    email: payload.email,
    type: payload.type,
  };
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}