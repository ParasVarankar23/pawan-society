import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import Room from "@/models/Room";
import { connectDB } from "@/lib/mongodb";
import {
  getRoomLedger,
} from "@/services/ledgerService";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const room =
        await Room.findOne({
          roomNumber: params.roomNo,
        }).lean();

      if (!room) {
        throw new Error("Room not found");
      }

      return json(
        await getRoomLedger(
          room._id
        )
      );
    })
  );
}