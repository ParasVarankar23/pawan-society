import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteSocietyWork,
  getSocietyWorkById,
  updateSocietyWork,
} from "@/services/societyWorkService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const work = await getSocietyWorkById(params.id);

      if (!work) {
        throw new Error("Society work not found");
      }

      return json(work);
    })
  );
}

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