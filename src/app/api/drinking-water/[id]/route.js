import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  updateDrinkingWaterBill,
} from "@/services/drinkingWaterService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateDrinkingWaterBill(
          params.id,
          await getJsonBody(request)
        )
      );
    })
  );
}