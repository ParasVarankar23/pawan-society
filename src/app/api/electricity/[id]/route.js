import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteElectricityBill,
  updateElectricityBill,
} from "@/services/electricityService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await updateElectricityBill(
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
      const deletedBill = await deleteElectricityBill(id);

      if (!deletedBill) {
        return json(
          { message: "Electricity bill not found." },
          404
        );
      }

      return json({ message: "Electricity bill deleted." });
    })
  );
}