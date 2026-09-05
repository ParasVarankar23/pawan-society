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

export function setAccessTokenCookie(response, token) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    token,
    {
      ...baseCookieOptions,
      maxAge: 60 * 15,
    }
  );
}

export function setRefreshTokenCookie(response, token) {
  response.cookies.set(
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

export function clearAuthCookies(response) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    "",
    {
      ...baseCookieOptions,
      maxAge: 0,
    }
  );

  response.cookies.set(
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