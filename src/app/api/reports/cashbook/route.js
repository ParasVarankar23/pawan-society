import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getCashbook,
} from "@/services/cashbookService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getCashbook(
          getQuery(request)
        )
      );
    })
  );
}