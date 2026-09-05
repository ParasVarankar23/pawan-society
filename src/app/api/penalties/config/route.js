import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import PenaltyRule from "@/models/PenaltyRule";
import { connectDB } from "@/lib/mongodb";

export async function PUT(request) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const data =
        await getJsonBody(request);

      const rule =
        await PenaltyRule.findOneAndUpdate(
          {
            status: "ACTIVE",
          },
          {
            $set: data,
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true,
          }
        );

      return json(rule);
    })
  );
}