import {
  SignJWT,
  jwtVerify,
} from "jose";

import {
  getAccessTokenCookie,
} from "./cookies";

/* =====================================================
   ACCESS TOKEN SECRET
===================================================== */

function getAccessSecret() {
  const secret =
    process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not configured"
    );
  }

  return new TextEncoder().encode(secret);
}

/* =====================================================
   REFRESH TOKEN SECRET
===================================================== */

function getRefreshSecret() {
  const secret =
    process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not configured"
    );
  }

  return new TextEncoder().encode(secret);
}

/* =====================================================
   ACCESS TOKEN
===================================================== */

export async function createAccessToken({
  adminId,
  email,
}) {
  const expiresIn =
    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

  return new SignJWT({
    adminId,
    email,
    type: "access",
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(adminId.toString())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getAccessSecret());
}

/* =====================================================
   REFRESH TOKEN
===================================================== */

export async function createRefreshToken({
  adminId,
}) {
  const expiresIn =
    process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

  return new SignJWT({
    adminId,
    type: "refresh",
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(adminId.toString())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getRefreshSecret());
}

/* =====================================================
   VERIFY ACCESS TOKEN
===================================================== */

export async function verifyAccessToken(token) {
  try {
    if (!token) {
      return null;
    }

    const { payload } =
      await jwtVerify(
        token,
        getAccessSecret(),
        {
          algorithms: ["HS256"],
        }
      );

    if (payload.type !== "access") {
      return null;
    }

    if (!payload.adminId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/* =====================================================
   VERIFY REFRESH TOKEN
===================================================== */

export async function verifyRefreshToken(token) {
  try {
    if (!token) {
      return null;
    }

    const { payload } =
      await jwtVerify(
        token,
        getRefreshSecret(),
        {
          algorithms: ["HS256"],
        }
      );

    if (payload.type !== "refresh") {
      return null;
    }

    if (!payload.adminId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/* =====================================================
   GET AUTHENTICATED USER
===================================================== */

export async function getAuthUser() {
  const token =
    await getAccessTokenCookie();

  if (!token) {
    return null;
  }

  const payload =
    await verifyAccessToken(token);

  if (!payload) {
    return null;
  }

  return {
    adminId: payload.adminId,
    email: payload.email,
    type: payload.type,
  };
}

/* =====================================================
   REQUIRE AUTHENTICATION
===================================================== */

export async function requireAuth() {
  const user =
    await getAuthUser();

  if (!user) {
    const error =
      new Error("UNAUTHORIZED");

    error.statusCode = 401;

    throw error;
  }

  return user;
}