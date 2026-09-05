import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  calculateBill,
} from "@/services/billingService";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await calculateBill(
          await getJsonBody(request)
        )
      );
    })
  );
}