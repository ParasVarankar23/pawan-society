import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import Room from "@/models/Room";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  return apiHandler(() =>
    authenticated(async () => {
      const { rooms } =
        await getJsonBody(request);

      if (!Array.isArray(rooms)) {
        throw new Error(
          "rooms must be an array"
        );
      }

      await connectDB();

      const result =
        await Room.insertMany(
          rooms,
          { ordered: false }
        );

      return json(
        {
          imported:
            result.length,
        },
        201
      );
    })
  );
}