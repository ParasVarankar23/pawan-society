import {
  apiHandler,
  authenticated,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  getMembers,
} from "@/services/memberService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const { search } =
        getQuery(request);

      if (!search) {
        throw new Error(
          "Search value is required"
        );
      }

      return json(
        await getMembers(search)
      );
    })
  );
}