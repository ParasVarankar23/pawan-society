import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getIncomeReport,
  getExpenseReport,
  getCollectionReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const {
        date,
      } = getQuery(request);

      if (!date) {
        throw new Error(
          "date is required"
        );
      }

      const startDate =
        new Date(date);

      const endDate =
        new Date(date);

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      const [
        income,
        expenses,
        collection,
      ] = await Promise.all([
        getIncomeReport({
          startDate,
          endDate,
        }),
        getExpenseReport({
          startDate,
          endDate,
        }),
        getCollectionReport({
          startDate,
          endDate,
        }),
      ]);

      return json({
        date,
        income: income.total,
        expenses: expenses.total,
        collection:
          collection.total,
      });
    })
  );
}