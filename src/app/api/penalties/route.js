import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getActivePenaltyRule,
  createPenaltyRule,
} from "@/services/penaltyService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getActivePenaltyRule()
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await createPenaltyRule(
          await getJsonBody(request)
        ),
        201
      );
    })
  );
}