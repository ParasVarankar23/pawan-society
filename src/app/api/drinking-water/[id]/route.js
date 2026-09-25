import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteDrinkingWaterBill,
  updateDrinkingWaterBill,
} from "@/services/drinkingWaterService";

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(
        await updateDrinkingWaterBill(
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
      const deletedBill = await deleteDrinkingWaterBill(id);

      if (!deletedBill) {
        return json(
          { message: "Drinking water bill not found." },
          404
        );
      }

      return json({ message: "Drinking water bill deleted." });
    })
  );
}