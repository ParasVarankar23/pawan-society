import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createTransaction,
  getTransactions,
} from "@/services/transactionService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getTransactions(
          getQuery(request)
        )
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async (user) => {
      const data =
        await getJsonBody(request);

      return json(
        await createTransaction({
          ...data,
          createdBy:
            user.id || user._id,
        }),
        201
      );
    })
  );
}