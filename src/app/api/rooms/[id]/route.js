import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteRoom,
  getRoomById,
  updateRoom,
} from "@/services/roomService";

export async function GET(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(await getRoomById(params.id));
    })
  );
}

export async function PUT(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await updateRoom(
          params.id,
          await getJsonBody(request)
        )
      );
    })
  );
}

export async function DELETE(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(await deleteRoom(params.id));
    })
  );
}
