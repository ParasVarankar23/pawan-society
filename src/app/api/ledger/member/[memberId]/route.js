import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import {
  getMemberLedger,
} from "@/services/ledgerService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getMemberLedger(
          params.memberId
        )
      );
    })
  );
}