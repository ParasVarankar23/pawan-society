import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import {
  deleteBill,
  getBillById,
} from "@/services/billingService";
import { createPayment } from "@/services/paymentService";

import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import Payment from "@/models/Payment";

export async function GET(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;
      const bill =
        await getBillById(id);

      if (!bill) {
        throw new Error("Bill not found");
      }

      return json(bill);
    })
  );
}

export async function PUT(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async (user) => {
      await connectDB();
      const { id } = await params;
      const updates = await getJsonBody(request);
      const existingBill = await Bill.findById(id);

      if (!existingBill) {
        throw new Error("Bill not found");
      }

      const existingPayment =
        updates.status === "PAID"
          ? await Payment.findOne({
            billId: id,
            status: "SUCCESS",
          })
          : null;

      if (updates.status === "PAID" && !existingPayment) {
        const requestedPaidAmount = Number(
          updates.paidAmount ?? existingBill.totalOutstanding
        );
        const wasPreviouslyMarkedPaid =
          existingBill.status === "PAID" &&
          Number(existingBill.paidAmount || 0) > 0;
        const amount = wasPreviouslyMarkedPaid
          ? Number(existingBill.paidAmount)
          : Math.max(
            requestedPaidAmount - Number(existingBill.paidAmount || 0),
            0
          );

        if (amount <= 0) {
          throw new Error(
            "A payment amount is required to create the receipt"
          );
        }

        await createPayment({
          data: {
            roomId: existingBill.roomId,
            memberId: existingBill.memberId,
            billId: existingBill._id,
            amount,
            paymentDate: updates.paymentDate || new Date(),
            paymentMode: updates.paymentMode || "CASH",
            remarks: updates.remarks || "Payment recorded from billing",
          },
          adminId: user.adminId,
        });

        return json(await getBillById(id));
      }

      const bill =
        await Bill.findByIdAndUpdate(
          id,
          {
            $set: updates,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      return json(bill);
    })
  );
}

export async function DELETE(
  request,
  { params }
) {
  return apiHandler(() =>
    authenticated(async () => {
      const { id } = await params;

      return json(await deleteBill(id));
    })
  );
}