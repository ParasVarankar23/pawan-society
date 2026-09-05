import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getExpenseReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getExpenseReport(
          getQuery(request)
        )
      );
    })
  );
}