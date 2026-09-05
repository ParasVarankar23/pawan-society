import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getIncomeReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getIncomeReport(
          getQuery(request)
        )
      );
    })
  );
}