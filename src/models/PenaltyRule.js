import mongoose from "mongoose";

const PenaltyRuleSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },

    rateType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      default: "PERCENTAGE",
    },

    rate: {
      type: Number,
      default: 12,
      min: 0,
    },

    gracePeriodDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    calculationType: {
      type: String,
      enum: [
        "ON_OUTSTANDING",
        "ON_CURRENT_BILL",
        "ON_PRINCIPAL",
      ],
      default: "ON_OUTSTANDING",
    },

    frequency: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY", "DAILY"],
      default: "MONTHLY",
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

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PenaltyRule ||
  mongoose.model("PenaltyRule", PenaltyRuleSchema);