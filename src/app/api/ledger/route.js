import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getLedgerEntries,
  getMemberLedger,
  getRoomLedger,
} from "@/services/ledgerService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);

      if (query.memberId) {
        return json(
          await getMemberLedger(
            query.memberId
          )
        );
      }

      if (query.roomId) {
        return json(
          await getRoomLedger(
            query.roomId
          )
        );
      }

      return json(
        await getLedgerEntries({
          transactionType:
            query.transactionType,
          fromDate: query.fromDate,
          toDate: query.toDate,
        })
      );
    })
  );
}