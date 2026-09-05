import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "BILL",
        "RECEIPT",
        "REMINDER",
        "OTP",
        "REPORT",
        "TEST",
        "OTHER",
      ],
      required: true,
      index: true,
    },

    reference: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },

    sentAt: {
      type: Date,
      default: null,
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

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", EmailLogSchema);