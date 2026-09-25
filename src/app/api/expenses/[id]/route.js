import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();
      const { id } = await params;

      return json(
        await Expense.findById(
          id
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
      const { id } = await params;

      return json(
        await Expense.findByIdAndUpdate(
          id,
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

export async function DELETE(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();
      const { id } = await params;
      const deletedExpense = await Expense.findByIdAndDelete(id);

      if (!deletedExpense) {
        return json(
          { message: "Expense not found." },
          404
        );
      }

      return json({ message: "Expense deleted." });
    })
  );
}