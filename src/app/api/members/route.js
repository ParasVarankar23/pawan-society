import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createMember,
  getMembers,
} from "@/services/memberService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const { search } =
        getQuery(request);

      return json(
        await getMembers(search)
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await createMember(
          await getJsonBody(request)
        ),
        201
      );
    })
  );
}