import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteBill,
  getBillById,
} from "@/services/billingService";

import Bill from "@/models/Bill";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;
      const bill =
        await getBillById(id);

      if (!bill) {
        throw new Error("Bill not found");
      }

      return json(bill);
    })
  );
}

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();
      const { id } = await params;

      const bill =
        await Bill.findByIdAndUpdate(
          id,
          {
            $set:
              await getJsonBody(request),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      return json(bill);
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

      return json(await deleteBill(id));
    })
  );
}