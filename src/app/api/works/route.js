import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createSocietyWork,
  getSocietyWorks,
} from "@/services/societyWorkService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getSocietyWorks(
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
        await createSocietyWork({
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