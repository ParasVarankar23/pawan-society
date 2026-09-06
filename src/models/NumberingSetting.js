import mongoose from "mongoose";

const NumberingSettingSchema = new mongoose.Schema(
  {
    billPrefix: {
      type: String,
      default: "BILL",
      trim: true,
    },
    receiptPrefix: {
      type: String,
      default: "REC",
      trim: true,
    },
    billSequence: {
      type: Number,
      default: 1,
      min: 1,
    },
    receiptSequence: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.NumberingSetting ||
  mongoose.model("NumberingSetting", NumberingSettingSchema);