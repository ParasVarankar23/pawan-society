import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  generateBill,
} from "@/services/billingService";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const {
        roomId,
        billingMonth,
        dueDate,
      } = await getJsonBody(request);

      if (!roomId || !billingMonth) {
        throw new Error(
          "roomId and billingMonth are required"
        );
      }

      return json(
        await generateBill({
          roomId,
          billingMonth,
          dueDate,
        }),
        201
      );
    })
  );
}