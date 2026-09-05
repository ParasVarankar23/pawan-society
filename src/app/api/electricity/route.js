import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createElectricityBill,
  getElectricityBills,
} from "@/services/electricityService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getElectricityBills(
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
        await createElectricityBill({
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