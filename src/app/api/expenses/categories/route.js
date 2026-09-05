import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getExpenseCategories,
  createExpenseCategory,
} from "@/services/expenseService";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getExpenseCategories()
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await createExpenseCategory(
          await getJsonBody(request)
        ),
        201
      );
    })
  );
}