import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

import { connectDB } from "@/lib/mongodb";

import Bill from "@/models/Bill";
import FinancialTransaction from "@/models/FinancialTransaction";
import Member from "@/models/Member";
import Payment from "@/models/Payment";
import Room from "@/models/Room";

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
        activeRooms,
        recentPayments,
        overdueBills,
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

        Room.find({
          status: "ACTIVE",
        })
          .select("occupancyStatus")
          .lean(),

        Payment.find({
          status: "SUCCESS",
        })
          .populate("memberId")
          .populate("roomId")
          .sort({ paymentDate: -1, createdAt: -1 })
          .limit(6)
          .lean(),

        Bill.find({
          status: {
            $in: ["UNPAID", "PARTIAL", "OVERDUE", "GENERATED"],
          },
          balanceAmount: {
            $gt: 0,
          },
        })
          .populate("memberId")
          .populate("roomId")
          .sort({ dueDate: 1 })
          .limit(6)
          .lean(),
      ]);

      const roomStatus = [
        ["OCCUPIED", "Occupied"],
        ["RENTED", "Rented"],
        ["VACANT", "Vacant"],
        ["UNDER_MAINTENANCE", "Under Maintenance"],
      ]
        .map(([value, name]) => ({
          name,
          value: activeRooms.filter(
            (room) => room.occupancyStatus === value
          ).length,
        }))
        .filter((item) => item.value > 0);

      const monthly = [];
      const today = new Date();

      for (let offset = 5; offset >= 0; offset -= 1) {
        const monthDate = new Date(
          today.getFullYear(),
          today.getMonth() - offset,
          1
        );
        const year = monthDate.getFullYear();
        const monthNumber = monthDate.getMonth();
        const monthKey = `${year}-${String(monthNumber + 1).padStart(2, "0")}`;
        const monthName = monthDate.toLocaleDateString("en-IN", {
          month: "short",
        });

        const monthTransactions = transactions.filter((transaction) => {
          const date = new Date(transaction.transactionDate);
          return (
            date.getFullYear() === year &&
            date.getMonth() === monthNumber
          );
        });

        const monthPayments = payments.filter((payment) => {
          const date = new Date(payment.paymentDate || payment.createdAt);
          return (
            date.getFullYear() === year &&
            date.getMonth() === monthNumber
          );
        });

        monthly.push({
          month: monthName,
          monthKey,
          income: monthTransactions
            .filter((item) => item.type === "INCOME")
            .reduce((sum, item) => sum + Number(item.amount || 0), 0),
          expense: monthTransactions
            .filter((item) => item.type === "EXPENSE")
            .reduce((sum, item) => sum + Number(item.amount || 0), 0),
          collection: monthPayments.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
          ),
        });
      }

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
        monthly,
        collectionTrend: monthly,
        roomStatus,
        recentPayments,
        overdueBills,
      });
    })
  );
}