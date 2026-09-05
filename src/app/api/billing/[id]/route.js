import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
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
      const bill =
        await getBillById(params.id);

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

      const bill =
        await Bill.findByIdAndUpdate(
          params.id,
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