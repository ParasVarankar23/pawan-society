import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getAuditLogs,
} from "@/services/auditService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getAuditLogs(
          getQuery(request)
        )
      );
    })
  );
}