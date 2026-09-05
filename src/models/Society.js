import mongoose from "mongoose";

const SocietySchema = new mongoose.Schema(
  {
    societyName: {
      type: String,
      required: true,
      trim: true,
      default: "Pawan Society",
    },

    registrationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    sector: {
      type: String,
      trim: true,
      default: "7",
    },

    area: {
      type: String,
      trim: true,
      default: "Khanda Colony",
    },

    city: {
      type: String,
      trim: true,
      default: "New Panvel",
    },

    state: {
      type: String,
      trim: true,
      default: "Maharashtra",
    },

    pincode: {
      type: String,
      trim: true,
      default: "410206",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    contactNumber: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "parasvarankar235@gmail.com",
    },

    financialYearStartMonth: {
      type: Number,
      min: 1,
      max: 12,
      default: 4,
    },

    logoUrl: {
      type: String,
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

export default mongoose.models.Society ||
  mongoose.model("Society", SocietySchema);