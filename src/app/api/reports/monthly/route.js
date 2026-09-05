import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getMonthlyReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const {
        year,
        month,
      } = getQuery(request);

      if (!year || !month) {
        throw new Error(
          "year and month are required"
        );
      }

      return json(
        await getMonthlyReport(
          year,
          month
        )
      );
    })
  );
}