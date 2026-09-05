import {
  apiHandler,
} from "@/app/api/_utils";

import Member from "@/models/Member";
import Bill from "@/models/Bill";

import { connectDB } from "@/lib/mongodb";
import {
  sendReminder,
} from "@/services/emailService";

export async function GET(request) {
  return apiHandler(async () => {
    await connectDB();

    const members =
      await Member.find({
        status: "ACTIVE",
        email: {
          $exists: true,
          $ne: "",
        },
      }).lean();

    let sent = 0;

    for (const member of members) {
      const bills =
        await Bill.find({
          memberId: member._id,
          balanceAmount: {
            $gt: 0,
          },
          status: {
            $in: [
              "UNPAID",
              "PARTIAL",
              "OVERDUE",
            ],
          },
        }).lean();

      if (!bills.length) {
        continue;
      }

      const outstanding =
        bills.reduce(
          (sum, bill) =>
            sum + bill.balanceAmount,
          0
        );

      await sendReminder({
        recipient: member.email,
        data: {
          memberId: member._id,
          memberName: member.name,
          roomId: member.roomId,
          outstanding,
          bills,
        },
      });

      sent++;
    }

    return Response.json({
      success: true,
      sent,
    });
  });
}