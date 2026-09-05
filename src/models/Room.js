import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    wing: {
      type: String,
      trim: true,
      default: "",
    },

    floor: {
      type: Number,
      default: 0,
    },

    areaSqFt: {
      type: Number,
      default: 0,
      min: 0,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
      index: true,
    },

    occupancyStatus: {
      type: String,
      enum: [
        "OCCUPIED",
        "VACANT",
        "RENTED",
        "UNDER_MAINTENANCE",
      ],
      default: "VACANT",
    },

    parking: {
      type: String,
      default: "",
    },

    parkingCount: {
      type: Number,
      default: 0,
      min: 0,
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

export default mongoose.models.Room ||
  mongoose.model("Room", RoomSchema);