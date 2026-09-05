import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE || "pawan_access_token";

const REFRESH_TOKEN_COOKIE =
  process.env.REFRESH_TOKEN_COOKIE || "pawan_refresh_token";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function setAccessTokenCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    token,
    {
      ...baseCookieOptions,
      maxAge: 60 * 15,
    }
  );
}

export async function setRefreshTokenCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    token,
    {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    }
  );
}

export async function getAccessTokenCookie() {
  const cookieStore = await cookies();

  return cookieStore.get(
    ACCESS_TOKEN_COOKIE
  )?.value || null;
}

export async function getRefreshTokenCookie() {
  const cookieStore = await cookies();

  return cookieStore.get(
    REFRESH_TOKEN_COOKIE
  )?.value || null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    "",
    {
      ...baseCookieOptions,
      maxAge: 0,
    }
  );

  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    "",
    {
      ...baseCookieOptions,
      maxAge: 0,
    }
  );
}

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
};