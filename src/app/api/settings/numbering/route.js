import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import NumberingSetting from "@/models/NumberingSetting";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const settings = await NumberingSetting.findOne()
        .sort({ createdAt: -1 })
        .lean();

      return json(settings || {
        billPrefix: "BILL",
        receiptPrefix: "REC",
        billSequence: 1,
        receiptSequence: 1,
      });
    })
  );
}

export async function PUT(request) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const data = await getJsonBody(request);
      const settings = await NumberingSetting.findOneAndUpdate(
        {},
        {
          $set: {
            billPrefix: data.billPrefix,
            receiptPrefix: data.receiptPrefix,
            billSequence: Number(data.billSequence || 1),
            receiptSequence: Number(data.receiptSequence || 1),
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      ).lean();

      return json(settings);
    })
  );
}