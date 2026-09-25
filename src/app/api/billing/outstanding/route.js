import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getOutstandingReport,
} from "@/services/reportService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);

      return json(
        await getOutstandingReport({
          billingMonth: query.billingMonth,
          fromDate: query.fromDate,
          toDate: query.toDate,
        })
      );
    })
  );
}