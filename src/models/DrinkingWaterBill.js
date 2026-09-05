import mongoose from "mongoose";

const DrinkingWaterBillSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },

    billNumber: {
      type: String,
      trim: true,
      default: "",
    },

    billDate: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      default: "Litre",
      trim: true,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMode: {
      type: String,
      default: "",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    referenceNumber: {
      type: String,
      default: "",
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

export default mongoose.models.DrinkingWaterBill ||
  mongoose.model(
    "DrinkingWaterBill",
    DrinkingWaterBillSchema
  );