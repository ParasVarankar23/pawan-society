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
      const { id } = await params;

      return json(await getRoomById(id));
    })
  );
}

export async function PUT(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await updateRoom(
          id,
          await getJsonBody(request)
        )
      );
    })
  );
}

export async function DELETE(request, { params }) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(await deleteRoom(id));
    })
  );
}
