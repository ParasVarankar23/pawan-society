import Member from "@/models/Member";
import Room from "@/models/Room";
import { connectDB } from "@/lib/mongodb";

export async function createMember(data) {
  await connectDB();

  const member = await Member.create(data);

  if (data.roomId) {
    await Room.findByIdAndUpdate(
      data.roomId,
      {
        $set: {
          memberId: member._id,
          occupancyStatus: "OCCUPIED",
        },
      }
    );
  }

  return member;
}

export async function getMembers(search = "") {
  await connectDB();

  const query = {
    status: "ACTIVE",
  };

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        mobile: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return Member.find(query)
    .populate("roomId")
    .sort({ name: 1 })
    .lean();
}

export async function getMemberById(id) {
  await connectDB();

  return Member.findById(id)
    .populate("roomId")
    .lean();
}

export async function updateMember(id, data) {
  await connectDB();

  return Member.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteMember(id) {
  await connectDB();

  const member = await Member.findById(id);

  if (!member) {
    throw new Error("Member not found");
  }

  await Room.findByIdAndUpdate(
    member.roomId,
    {
      $unset: {
        memberId: 1,
      },
      $set: {
        occupancyStatus: "VACANT",
      },
    }
  );

  member.status = "INACTIVE";
  await member.save();

  return member;
}