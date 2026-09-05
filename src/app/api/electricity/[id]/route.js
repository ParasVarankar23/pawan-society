import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  updateElectricityBill,
} from "@/services/electricityService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateElectricityBill(
          params.id,
          await getJsonBody(request)
        )
      );
    })
  );
}