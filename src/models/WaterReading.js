import mongoose from "mongoose";

const WaterReadingSchema = new mongoose.Schema(
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

    billingMonth: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
      index: true,
    },

    previousReading: {
      type: Number,
      required: true,
      min: 0,
    },

    currentReading: {
      type: Number,
      required: true,
      min: 0,
    },

    units: {
      type: Number,
      required: true,
      min: 0,
    },

    ratePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    readingDate: {
      type: Date,
      default: Date.now,
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

WaterReadingSchema.index(
  { roomId: 1, billingMonth: 1 },
  { unique: true }
);

export default mongoose.models.WaterReading ||
  mongoose.model("WaterReading", WaterReadingSchema);