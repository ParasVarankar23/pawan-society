import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import { createPayment } from "@/services/paymentService";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async (user) => {
      return json(
        await createPayment({
          data: await getJsonBody(request),
          adminId: user.adminId,
        }),
        201
      );
    })
  );
}
