import mongoose from "mongoose";

const ChargeMasterSchema = new mongoose.Schema(
  {
    maintenance: {
      type: Number,
      default: 0,
      min: 0,
    },

    sinkingFund: {
      type: Number,
      default: 0,
      min: 0,
    },

    insurance: {
      type: Number,
      default: 0,
      min: 0,
    },

    educationFund: {
      type: Number,
      default: 0,
      min: 0,
    },

    parking: {
      type: Number,
      default: 0,
      min: 0,
    },

    nonOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },

    rentNoc: {
      type: Number,
      default: 0,
      min: 0,
    },

    other: {
      type: Number,
      default: 0,
      min: 0,
    },

    waterRatePerUnit: {
      type: Number,
      default: 9,
      min: 0,
    },

    effectiveFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },

    effectiveTo: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChargeMaster ||
  mongoose.model("ChargeMaster", ChargeMasterSchema);