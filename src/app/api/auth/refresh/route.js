import {
  apiHandler,
  getClientInfo,
  json,
} from "@/app/api/_utils";

import {
  getRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/cookies";

import {
  refreshAccessToken,
} from "@/services/refreshTokenService";

export async function POST(request) {
  return apiHandler(async () => {
    const refreshToken =
      await getRefreshTokenCookie();

    if (!refreshToken) {
      const error =
        new Error("Refresh token required");
      error.statusCode = 401;
      throw error;
    }

    const { userAgent, ipAddress } =
      getClientInfo(request);

    const result = await refreshAccessToken({
      refreshToken,
      userAgent,
      ipAddress,
    });

    const response = json({
      message: "Token refreshed successfully",
    });

    setAccessTokenCookie(response, result.accessToken);

    setRefreshTokenCookie(response, result.refreshToken);

    return response;
  });
}