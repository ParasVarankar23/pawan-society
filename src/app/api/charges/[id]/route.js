import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  updateCharge,
} from "@/services/chargeService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateCharge(
          params.id,
          await getJsonBody(request)
        )
      );
    })
  );
}