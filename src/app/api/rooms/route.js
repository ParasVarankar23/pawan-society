import {
  apiHandler,
  authenticated,
  getJsonBody,
  getQuery,
  json,
} from "@/app/api/_utils";

import {
  createRoom,
  getRooms,
} from "@/services/roomService";

export async function GET(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const query = getQuery(request);

      return json(
        await getRooms({
          search: query.search,
          status: query.status,
        })
      );
    })
  );
}

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const data =
        await getJsonBody(request);

      return json(
        await createRoom(data),
        201
      );
    })
  );
}