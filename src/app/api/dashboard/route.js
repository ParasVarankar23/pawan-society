import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import { connectDB } from "@/lib/mongodb";

import Room from "@/models/Room";
import Member from "@/models/Member";
import Bill from "@/models/Bill";
import Payment from "@/models/Payment";
import FinancialTransaction from "@/models/FinancialTransaction";

export async function GET() {
  return apiHandler(() =>
    authenticated(async () => {
      await connectDB();

      const [
        totalRooms,
        totalMembers,
        unpaidBills,
        payments,
        transactions,
      ] = await Promise.all([
        Room.countDocuments({
          status: "ACTIVE",
        }),

        Member.countDocuments({
          status: "ACTIVE",
        }),

        Bill.find({
          status: {
            $in: [
              "UNPAID",
              "PARTIAL",
              "OVERDUE",
            ],
          },
          balanceAmount: {
            $gt: 0,
          },
        }).lean(),

        Payment.find({
          status: "SUCCESS",
        }).lean(),

        FinancialTransaction.find({
          status: "ACTIVE",
        }).lean(),
      ]);

      const outstanding =
        unpaidBills.reduce(
          (sum, bill) =>
            sum + bill.balanceAmount,
          0
        );

      const totalCollection =
        payments.reduce(
          (sum, payment) =>
            sum + payment.amount,
          0
        );

      const totalIncome =
        transactions
          .filter(
            (item) =>
              item.type === "INCOME"
          )
          .reduce(
            (sum, item) =>
              sum + item.amount,
            0
          );

      const totalExpenses =
        transactions
          .filter(
            (item) =>
              item.type === "EXPENSE"
          )
          .reduce(
            (sum, item) =>
              sum + item.amount,
            0
          );

      return json({
        totalRooms,
        totalMembers,
        outstanding,
        totalCollection,
        totalIncome,
        totalExpenses,
        currentBalance:
          totalIncome -
          totalExpenses,
      });
    })
  );
}