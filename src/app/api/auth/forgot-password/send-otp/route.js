import {
  apiHandler,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  createAndSendOtp,
} from "@/services/otpService";

export async function POST(request) {
  return apiHandler(async () => {
    const { email } =
      await getJsonBody(request);

    if (!email) {
      throw new Error("Email is required");
    }

    await createAndSendOtp(email);

    return json({
      message:
        "OTP sent successfully",
    });
  });
}