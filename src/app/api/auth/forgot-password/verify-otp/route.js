import {
  apiHandler,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  verifyOtp,
} from "@/services/otpService";

export async function POST(request) {
  return apiHandler(async () => {
    const {
      email,
      otp,
    } = await getJsonBody(request);

    if (!email || !otp) {
      throw new Error(
        "Email and OTP are required"
      );
    }

    const result =
      await verifyOtp({
        email,
        otp,
      });

    return json(result);
  });
}