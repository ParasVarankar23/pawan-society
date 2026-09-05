import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    alternateMobile: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      index: true,
    },

    memberType: {
      type: String,
      enum: ["OWNER", "TENANT", "OTHER"],
      default: "OWNER",
    },

    occupancyType: {
      type: String,
      enum: ["SELF", "RENTED", "VACANT"],
      default: "SELF",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    joiningDate: {
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

export default mongoose.models.Member ||
  mongoose.model("Member", MemberSchema);