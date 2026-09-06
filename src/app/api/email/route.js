import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import { getEmailLogs } from "@/services/emailService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const { type } = getQuery(request);
      const filters = type ? { type } : {};

      return json(await getEmailLogs(filters));
    })
  );
}