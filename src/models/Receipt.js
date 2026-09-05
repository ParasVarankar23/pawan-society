import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
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

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    receiptDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      required: true,
    },

    billNumbers: [
      {
        type: Number,
      },
    ],

    pdfUrl: {
      type: String,
      default: "",
    },

    emailStatus: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED", "NOT_SENT"],
      default: "NOT_SENT",
    },

    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Receipt ||
  mongoose.model("Receipt", ReceiptSchema);