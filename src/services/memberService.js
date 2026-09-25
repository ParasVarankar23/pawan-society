import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import Room from "@/models/Room";

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

  const members = await Member.find(query)
    .populate("roomId")
    .lean();

  return members.sort((firstMember, secondMember) => {
    const firstRoomNumber = Number(
      firstMember.roomId?.roomNumber
    );
    const secondRoomNumber = Number(
      secondMember.roomId?.roomNumber
    );

    if (Number.isNaN(firstRoomNumber)) {
      return Number.isNaN(secondRoomNumber) ? 0 : 1;
    }

    if (Number.isNaN(secondRoomNumber)) {
      return -1;
    }

    return firstRoomNumber - secondRoomNumber;
  });
}

export async function getMemberById(id) {
  await connectDB();

  return Member.findById(id)
    .populate("roomId")
    .lean();
}

export async function updateMember(id, data) {
  await connectDB();

  const member = await Member.findById(id);

  if (!member) {
    throw new Error("Member not found");
  }

  const oldRoomId = member.roomId?.toString();
  const newRoomId = data.roomId?.toString();

  if (oldRoomId !== newRoomId) {
    await Room.findByIdAndUpdate(oldRoomId, {
      $unset: { memberId: 1 },
      $set: { occupancyStatus: "VACANT" },
    });

    await Room.findByIdAndUpdate(newRoomId, {
      $set: {
        memberId: member._id,
        occupancyStatus: "OCCUPIED",
      },
    });
  }

  return Member.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
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