import {
  apiHandler,
} from "@/app/api/_utils";

import Room from "@/models/Room";

import {
  generateBill,
} from "@/services/billingService";

import { connectDB } from "@/lib/mongodb";

export async function GET() {
  return apiHandler(async () => {
    await connectDB();

    const now = new Date();

    const billingMonth =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    const rooms =
      await Room.find({
        status: "ACTIVE",
        occupancyStatus: {
          $ne: "UNDER_MAINTENANCE",
        },
      }).lean();

    let generated = 0;
    let skipped = 0;

    for (const room of rooms) {
      try {
        await generateBill({
          roomId: room._id,
          billingMonth,
        });

        generated++;
      } catch (error) {
        console.error(
          `Bill generation failed for room ${room.roomNumber}:`,
          error.message
        );

        skipped++;
      }
    }

    return Response.json({
      success: true,
      billingMonth,
      generated,
      skipped,
    });
  });
}