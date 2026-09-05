import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  updateReading,
} from "@/services/waterService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateReading(
          params.id,
          await getJsonBody(request)
        )
      );
    })
  );
}