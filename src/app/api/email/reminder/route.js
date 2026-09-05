import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  sendReminder,
} from "@/services/emailService";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const {
        recipient,
        data,
      } = await getJsonBody(request);

      if (!recipient) {
        throw new Error(
          "Recipient email is required"
        );
      }

      return json(
        await sendReminder({
          recipient,
          data,
        })
      );
    })
  );
}