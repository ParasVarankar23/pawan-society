import mongoose from "mongoose";

const LedgerEntrySchema = new mongoose.Schema(
  {
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

    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    transactionType: {
      type: String,
      enum: [
        "BILL",
        "PAYMENT",
        "PENALTY",
        "ADJUSTMENT",
        "OPENING_BALANCE",
        "CREDIT",
        "DEBIT",
      ],
      required: true,
    },

    referenceType: {
      type: String,
      enum: [
        "BILL",
        "PAYMENT",
        "RECEIPT",
        "MANUAL",
        "PENALTY",
      ],
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    debit: {
      type: Number,
      default: 0,
      min: 0,
    },

    credit: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

LedgerEntrySchema.index({
  roomId: 1,
  date: 1,
});

export default mongoose.models.LedgerEntry ||
  mongoose.model("LedgerEntry", LedgerEntrySchema);