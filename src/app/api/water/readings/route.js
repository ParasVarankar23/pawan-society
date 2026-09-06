import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createReading,
  getReadings,
} from "@/services/waterService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getReadings(getQuery(request))
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await createReading(
          await getJsonBody(request)
        ),
        201
      );
    })
  );
}