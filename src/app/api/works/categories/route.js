import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  DEFAULT_WORK_CATEGORIES,
} from "@/constants/workCategories";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        DEFAULT_WORK_CATEGORIES
      );
    })
  );
}