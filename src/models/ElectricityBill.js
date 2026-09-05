import mongoose from "mongoose";

const ElectricityBillSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
      trim: true,
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
    },

    dueDate: {
      type: Date,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    paymentMode: {
      type: String,
      default: "",
    },

    referenceNumber: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
    },

    attachmentUrl: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ElectricityBill ||
  mongoose.model(
    "ElectricityBill",
    ElectricityBillSchema
  );