import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createDrinkingWaterBill,
  getDrinkingWaterBills,
} from "@/services/drinkingWaterService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getDrinkingWaterBills(
          getQuery(request)
        )
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async (user) => {
      return json(
        await createDrinkingWaterBill({
          data:
            await getJsonBody(request),
          adminId:
            user.id || user._id,
        }),
        201
      );
    })
  );
}