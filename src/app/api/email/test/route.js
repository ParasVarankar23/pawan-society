import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  sendEmail,
} from "@/lib/email/transporter";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const {
        recipient,
      } = await getJsonBody(request);

      if (!recipient) {
        throw new Error(
          "Recipient email is required"
        );
      }

      const result =
        await sendEmail({
          to: recipient,
          subject:
            "Pawan Society Email Test",
          html: `
            <h2>Pawan Society</h2>
            <p>This is a test email.</p>
            <p>Email configuration is working correctly.</p>
          `,
        });

      return json(result);
    })
  );
}