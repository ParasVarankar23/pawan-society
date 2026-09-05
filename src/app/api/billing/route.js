import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getBills,
} from "@/services/billingService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);

      const filters = {};

      if (query.roomId)
        filters.roomId = query.roomId;

      if (query.memberId)
        filters.memberId = query.memberId;

      if (query.billingMonth)
        filters.billingMonth =
          query.billingMonth;

      if (query.status)
        filters.status =
          query.status;

      return json(
        await getBills(filters)
      );
    })
  );
}