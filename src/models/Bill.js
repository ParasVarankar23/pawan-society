import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    billNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },

    billingMonth: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
      index: true,
    },

    billDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    previousOutstanding: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentCharges: {
      maintenance: {
        type: Number,
        default: 0,
      },

      sinkingFund: {
        type: Number,
        default: 0,
      },

      insurance: {
        type: Number,
        default: 0,
      },

      educationFund: {
        type: Number,
        default: 0,
      },

      parking: {
        type: Number,
        default: 0,
      },

      nonOccupancy: {
        type: Number,
        default: 0,
      },

      rentNoc: {
        type: Number,
        default: 0,
      },

      water: {
        type: Number,
        default: 0,
      },

      other: {
        type: Number,
        default: 0,
      },
    },

    penalty: {
      amount: {
        type: Number,
        default: 0,
      },

      rate: {
        type: Number,
        default: 0,
      },

      rateType: {
        type: String,
        default: "PERCENTAGE",
      },

      calculationType: {
        type: String,
        default: "ON_OUTSTANDING",
      },

      appliedDate: {
        type: Date,
        default: null,
      },
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalOutstanding: {
      type: Number,
      default: 0,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "GENERATED",
        "UNPAID",
        "PARTIAL",
        "PAID",
        "OVERDUE",
        "CANCELLED",
      ],
      default: "DRAFT",
      index: true,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

BillSchema.index(
  { roomId: 1, billingMonth: 1 },
  { unique: true }
);

export default mongoose.models.Bill ||
  mongoose.model("Bill", BillSchema);