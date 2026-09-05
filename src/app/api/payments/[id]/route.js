import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import Payment from "@/models/Payment";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const payment =
        await Payment.findById(params.id)
          .populate("roomId")
          .populate("memberId")
          .populate("billId")
          .lean();

      if (!payment) {
        throw new Error(
          "Payment not found"
        );
      }

      return json(payment);
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

      return json(
        await Payment.findByIdAndUpdate(
          params.id,
          {
            $set:
              await getJsonBody(request),
          },
          {
            new: true,
            runValidators: true,
          }
        )
      );
    })
  );
}