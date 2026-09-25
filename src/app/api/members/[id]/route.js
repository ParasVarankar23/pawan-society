import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteMember,
  getMemberById,
  updateMember,
} from "@/services/memberService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await getMemberById(id)
      );
    })
  );
}

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await updateMember(
          id,
          await getJsonBody(request)
        )
      );
    })
  );
}

export async function DELETE(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await deleteMember(id)
      );
    })
  );
}