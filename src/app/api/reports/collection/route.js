import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getCollectionReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getCollectionReport(
          getQuery(request)
        )
      );
    })
  );
}