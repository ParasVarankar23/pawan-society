import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getCurrentCharges,
  createCharge,
  getChargeHistory,
} from "@/services/chargeService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getChargeHistory()
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await createCharge(
          await getJsonBody(request)
        ),
        201
      );
    })
  );
}