import Bill from "@/models/Bill";
import ChargeMaster from "@/models/ChargeMaster";
import Member from "@/models/Member";
import Room from "@/models/Room";
import WaterReading from "@/models/WaterReading";

import { calculateMonthlyBill } from "@/lib/calculations/billing";
import { connectDB } from "@/lib/mongodb";
import { generateBillNumber } from "@/lib/numbering/billNumber";
import { sendBill } from "@/services/emailService";
import { getActivePenaltyRule } from "@/services/penaltyService";

function defaultDueDate(billingMonth) {
  const billingDate = new Date(`${billingMonth}-01T00:00:00`);
  billingDate.setMonth(billingDate.getMonth() + 1);
  billingDate.setDate(15);

  return billingDate;
}

export async function calculateBill({
  roomId,
  billingMonth,
}) {
  await connectDB();

  const room = await Room.findById(roomId).lean();

  if (!room) {
    throw new Error("Room not found");
  }

  const charges = await ChargeMaster.findOne({
    status: "ACTIVE",
    effectiveFrom: { $lte: new Date() },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gte: new Date() } },
    ],
  })
    .sort({ effectiveFrom: -1 })
    .lean();

  if (!charges) {
    throw new Error("Charge settings not configured");
  }

  const water = await WaterReading.findOne({
    roomId,
    billingMonth,
  }).lean();

  if (!water) {
    throw new Error(
      `Water reading is required for room ${room.roomNumber} and billing month ${billingMonth}`
    );
  }

  console.log("[billing] source values", {
    roomId: String(roomId),
    roomNumber: room.roomNumber,
    billingMonth,
    charges: {
      maintenance: charges.maintenance,
      sinkingFund: charges.sinkingFund,
      insurance: charges.insurance,
      educationFund: charges.educationFund,
      parking: charges.parking,
      nonOccupancy: charges.nonOccupancy,
      rentNoc: charges.rentNoc,
      other: charges.other,
      waterRatePerUnit: charges.waterRatePerUnit,
    },
    water: {
      currentReading: water.currentReading,
      units: water.units,
      ratePerUnit: water.ratePerUnit,
      amount: water.amount,
    },
  });

  const previousBills = await Bill.find({
    roomId,
    billingMonth: { $lt: billingMonth },
    status: {
      $nin: ["CANCELLED"],
    },
  })
    .sort({ billingMonth: -1 })
    .lean();

  const previousOutstanding =
    previousBills.length > 0
      ? previousBills[0].balanceAmount
      : 0;

  const penaltyRule = await getActivePenaltyRule();

  const calculation = calculateMonthlyBill({
    charges,
    water,
    previousOutstanding,
    penaltyRule,
    billingMonth,
  });

  console.log("[billing] calculated values", {
    billingMonth,
    currentCharges: calculation.currentCharges,
    previousOutstanding: calculation.previousOutstanding,
    penalty: calculation.penalty,
    totalOutstanding: calculation.totalOutstanding,
    balanceAmount: calculation.balanceAmount,
  });

  return calculation;
}

export async function generateBill({
  roomId,
  billingMonth,
  dueDate,
}) {
  await connectDB();

  const existing = await Bill.findOne({
    roomId,
    billingMonth,
  });

  if (existing) {
    throw new Error(
      "Bill already exists for this room and month"
    );
  }

  const room = await Room.findById(roomId).lean();

  if (!room) {
    throw new Error("Room not found");
  }

  const member = await Member.findOne({
    roomId,
    status: "ACTIVE",
  }).lean();

  if (!member) {
    throw new Error("Active member not found");
  }

  const calculation = await calculateBill({
    roomId,
    billingMonth,
  });

  const billNumber = await generateBillNumber();

  const bill = await Bill.create({
    billNumber,
    roomId,
    memberId: member._id,
    billingMonth,
    billDate: new Date(),
    dueDate: dueDate || defaultDueDate(billingMonth),

    previousOutstanding:
      calculation.previousOutstanding,

    currentCharges:
      calculation.currentCharges,

    penalty:
      calculation.penalty,

    subtotal:
      calculation.subtotal,

    totalOutstanding:
      calculation.totalOutstanding,

    paidAmount: 0,

    balanceAmount:
      calculation.totalOutstanding,

    status: "GENERATED",
  });

  let emailStatus = "SKIPPED";

  if (member.email) {
    try {
      console.log("[billing] email values", {
        billNumber,
        recipientConfigured: Boolean(member.email),
        billingMonth,
        currentCharges: calculation.currentCharges,
        totalOutstanding: calculation.totalOutstanding,
        balanceAmount: calculation.balanceAmount,
      });

      await sendBill({
        bill: {
          ...bill.toObject(),
          roomId: room,
          memberId: member,
          currentCharges: calculation.currentCharges,
          penalty: calculation.penalty,
          totalOutstanding: calculation.totalOutstanding,
          balanceAmount: calculation.balanceAmount,
        },
        recipient: member.email,
      });
      emailStatus = "SENT";
    } catch (error) {
      console.error(
        `Bill email failed for bill ${bill.billNumber}:`,
        error
      );
      emailStatus = "FAILED";
    }
  }

  return {
    ...bill.toObject(),
    emailStatus,
  };
}

export async function getBills(filters = {}) {
  await connectDB();

  return Bill.find(filters)
    .populate("roomId")
    .populate("memberId")
    .sort({
      billingMonth: -1,
      roomId: 1,
    })
    .lean();
}

export async function getBillById(id) {
  await connectDB();

  return Bill.findById(id)
    .populate("roomId")
    .populate("memberId")
    .lean();
}

export async function deleteBill(id) {
  await connectDB();

  const bill = await Bill.findByIdAndDelete(id);

  if (!bill) {
    throw new Error("Bill not found");
  }

  return bill;
}