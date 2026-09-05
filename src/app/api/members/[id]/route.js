import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  getMemberById,
  updateMember,
  deleteMember,
} from "@/services/memberService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      return json(
        await getMemberById(params.id)
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
      return json(
        await updateMember(
          params.id,
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
      return json(
        await deleteMember(params.id)
      );
    })
  );
}