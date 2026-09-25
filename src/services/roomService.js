import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import Room from "@/models/Room";

export async function createRoom(data) {
  await connectDB();

  return Room.create(data);
}

export async function getRooms({
  search = "",
  status,
} = {}) {
  await connectDB();

  const query = {
    status: "ACTIVE",
  };

  if (search) {
    query.roomNumber = {
      $regex: search,
      $options: "i",
    };
  }

  if (status) {
    query.status = status;
  }

  return Room.find(query)
    .populate("memberId")
    .sort({ roomNumber: 1 })
    .collation({
      locale: "en",
      numericOrdering: true,
    })
    .lean();
}

export async function getRoomById(id) {
  await connectDB();

  return Room.findById(id)
    .populate("memberId")
    .lean();
}

export async function updateRoom(id, data) {
  await connectDB();

  return Room.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
}

export async function deleteRoom(id) {
  await connectDB();

  const member = await Member.findOne({
    roomId: id,
  });

  if (member) {
    throw new Error(
      "Cannot delete room while a member is linked to it"
    );
  }

  return Room.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "INACTIVE",
      },
    },
    { new: true }
  );
}