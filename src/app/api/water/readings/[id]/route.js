import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteReading,
  updateReading,
} from "@/services/waterService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await updateReading(
          id,
          await getJsonBody(request)
        )
      );
    })
  );
}

export async function DELETE(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(await deleteReading(id));
    })
  );
}