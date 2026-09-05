import mongoose from "mongoose";

const SocietyWorkSchema = new mongoose.Schema(
  {
    workName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    vendorName: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      default: null,
    },

    completionDate: {
      type: Date,
      default: null,
    },

    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    actualCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    billNumber: {
      type: String,
      trim: true,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
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

    attachments: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLANNED",
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

export default mongoose.models.SocietyWork ||
  mongoose.model("SocietyWork", SocietyWorkSchema);