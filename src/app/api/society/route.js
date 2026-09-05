import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getSociety,
  createOrUpdateSociety,
} from "@/services/societyService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(await getSociety());
    })
  );
}

export async function PUT(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const data = await getJsonBody(request);

      return json(
        await createOrUpdateSociety(data)
      );
    })
  );
}