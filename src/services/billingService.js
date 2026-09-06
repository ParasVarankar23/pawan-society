import Bill from "@/models/Bill";
import Room from "@/models/Room";
import Member from "@/models/Member";
import ChargeMaster from "@/models/ChargeMaster";
import WaterReading from "@/models/WaterReading";

import { connectDB } from "@/lib/mongodb";
import { calculateMonthlyBill } from "@/lib/calculations/billing";
import { getActivePenaltyRule } from "@/services/penaltyService";
import { generateBillNumber } from "@/lib/numbering/billNumber";

export async function calculateBill({
  roomId,
  billingMonth,
}) {
  await connectDB();

  const room = await Room.findById(roomId).lean();

  if (!room) {
    throw new Error("Room not found");
  }

  const member = await Member.findOne({
    roomId,
    status: "ACTIVE",
  }).lean();

  const charges = await ChargeMaster.findOne({
    status: "ACTIVE",
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

  return calculateMonthlyBill({
    charges,
    water,
    previousOutstanding,
    penaltyRule,
    billingMonth,
  });
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

  return Bill.create({
    billNumber,
    roomId,
    memberId: member._id,
    billingMonth,
    billDate: new Date(),
    dueDate,

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