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
      const query =
        getQuery(request);

      return json(
        await getCashbook({
          startDate:
            query.startDate,
          endDate:
            query.endDate,
        })
      );
    })
  );
}