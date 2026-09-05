import {
  apiHandler,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  resetPassword,
} from "@/services/passwordResetService";

export async function POST(request) {
  return apiHandler(async () => {
    const {
      email,
      otpId,
      newPassword,
    } = await getJsonBody(request);

    if (
      !email ||
      !otpId ||
      !newPassword
    ) {
      throw new Error(
        "Email, OTP verification and new password are required"
      );
    }

    if (newPassword.length < 8) {
      throw new Error(
        "Password must contain at least 8 characters"
      );
    }

    await resetPassword({
      email,
      otpId,
      newPassword,
    });

    return json({
      message:
        "Password reset successfully",
    });
  });
}