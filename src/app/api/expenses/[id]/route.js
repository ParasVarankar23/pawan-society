import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import Expense from "@/models/Expense";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      return json(
        await Expense.findById(
          params.id
        )
          .populate("category")
          .lean()
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
      await connectDB();

      return json(
        await Expense.findByIdAndUpdate(
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