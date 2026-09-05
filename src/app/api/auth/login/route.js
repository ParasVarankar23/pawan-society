import {
  apiHandler,
  getClientInfo,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import { loginAdmin } from "@/services/authService";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/cookies";

export async function POST(request) {
  return apiHandler(async () => {
    const body = await getJsonBody(request);

    const { email, password } = body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { userAgent, ipAddress } =
      getClientInfo(request);

    const result = await loginAdmin({
      email,
      password,
      userAgent,
      ipAddress,
    });

    const response = json({
      admin: result.admin,
    });

    setAccessTokenCookie(
      response,
      result.accessToken
    );

    setRefreshTokenCookie(
      response,
      result.refreshToken
    );

    return response;
  });
}