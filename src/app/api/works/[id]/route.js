import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  updateSocietyWork,
  deleteSocietyWork,
} from "@/services/societyWorkService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateSocietyWork(
          params.id,
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
      return json(
        await deleteSocietyWork(
          params.id
        )
      );
    })
  );
}