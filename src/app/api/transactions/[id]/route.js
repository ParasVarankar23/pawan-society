import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import {
  cancelTransaction,
} from "@/services/transactionService";

export async function DELETE(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await cancelTransaction(
          params.id
        )
      );
    })
  );
}