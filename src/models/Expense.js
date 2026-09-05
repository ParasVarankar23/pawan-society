import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategory",
      required: true,
    },

    vendorName: {
      type: String,
      trim: true,
      default: "",
    },

    billNumber: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMode: {
      type: String,
      enum: [
        "CASH",
        "CHEQUE",
        "BANK_TRANSFER",
        "UPI",
        "NEFT",
        "RTGS",
        "IMPS",
        "OTHER",
      ],
      default: "CASH",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },

    attachmentUrl: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);