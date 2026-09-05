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
      const { year } =
        getQuery(request);

      if (!year) {
        throw new Error(
          "year is required"
        );
      }

      const reports = [];

      for (let month = 1; month <= 12; month++) {
        reports.push(
          await getMonthlyReport(
            year,
            month
          )
        );
      }

      return json({
        year: Number(year),
        months: reports,
        totals: {
          income: reports.reduce(
            (sum, item) =>
              sum + item.income,
            0
          ),
          expenses: reports.reduce(
            (sum, item) =>
              sum + item.expenses,
            0
          ),
          collection:
            reports.reduce(
              (sum, item) =>
                sum + item.collection,
              0
            ),
        },
      });
    })
  );
}