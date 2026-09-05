import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getReceipts,
} from "@/services/receiptService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);

      const filters = {};

      if (query.roomId)
        filters.roomId = query.roomId;

      if (query.memberId)
        filters.memberId = query.memberId;

      if (query.paymentId)
        filters.paymentId =
          query.paymentId;

      return json(
        await getReceipts(filters)
      );
    })
  );
}