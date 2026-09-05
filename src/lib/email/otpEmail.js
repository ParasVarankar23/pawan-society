import { sendEmail } from "./transporter";

export async function sendOtpEmail({
  email,
  otp,
}) {
  return sendEmail({
    to: email,
    subject:
      "Pawan Society - Password Reset OTP",

    text:
      `Your Pawan Society password reset OTP is ${otp}. ` +
      `This OTP is valid for 10 minutes.`,

    html: `
      <div style="font-family:Arial,sans-serif;">
        <h2>Pawan Society</h2>

        <p>
          Your password reset OTP is:
        </p>

        <h1 style="letter-spacing:8px;">
          ${otp}
        </h1>

        <p>
          This OTP is valid for 10 minutes.
        </p>

        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>
      </div>
    `,
  });
}