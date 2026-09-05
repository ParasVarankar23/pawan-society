import bcrypt from "bcryptjs";

import {
  apiHandler,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  return apiHandler(async () => {
    await connectDB();

    const existing =
      await Admin.countDocuments();

    if (existing > 0) {
      throw new Error(
        "Admin setup has already been completed"
      );
    }

    const {
      name,
      email,
      password,
    } = await getJsonBody(request);

    if (!name || !email || !password) {
      throw new Error(
        "Name, email and password are required"
      );
    }

    if (password.length < 8) {
      throw new Error(
        "Password must contain at least 8 characters"
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      status: "ACTIVE",
    });

    return json(
      {
        id: admin._id,
        message:
          "Admin setup completed",
      },
      201
    );
  });
}