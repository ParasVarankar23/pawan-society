import {
  apiHandler,
  json,
} from "@/app/api/_utils";

import {
  getRefreshTokenCookie,
  clearAuthCookies,
} from "@/lib/cookies";

import {
  revokeRefreshToken,
} from "@/services/refreshTokenService";

export async function POST() {
  return apiHandler(async () => {
    const refreshToken =
      await getRefreshTokenCookie();

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const response = json({
      message: "Logged out successfully",
    });

    clearAuthCookies(response);

    return response;
  });
}