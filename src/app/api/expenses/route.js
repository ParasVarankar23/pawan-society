import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createExpense,
  getExpenses,
} from "@/services/expenseService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);
      const filters = {
        status: "ACTIVE",
      };

      if (query.category) {
        filters.category = query.category;
      }

      if (query.fromDate || query.toDate) {
        filters.date = {};

        if (query.fromDate) {
          filters.date.$gte = new Date(`${query.fromDate}T00:00:00`);
        }

        if (query.toDate) {
          filters.date.$lte = new Date(`${query.toDate}T23:59:59.999`);
        }
      }

      return json(await getExpenses(filters));
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async (user) => {
      return json(
        await createExpense({
          data: await getJsonBody(request),
          adminId: user.id || user._id,
        }),
        201
      );
    })
  );
}