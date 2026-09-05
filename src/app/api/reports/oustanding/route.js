import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import {
  getOutstandingReport,
} from "@/services/reportService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getOutstandingReport()
      );
    })
  );
}