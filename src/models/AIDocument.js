import mongoose from "mongoose";

const AIDocumentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },

    documentType: {
      type: String,
      enum: [
        "BILL",
        "RECEIPT",
        "ELECTRICITY",
        "WATER",
        "EXPENSE",
        "OTHER",
      ],
      default: "OTHER",
    },

    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    provider: {
      type: String,
      enum: ["GEMINI", "MANUAL", "OTHER"],
      default: "MANUAL",
    },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED", "VERIFIED"],
      default: "PENDING",
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AIDocument ||
  mongoose.model("AIDocument", AIDocumentSchema);