import bcrypt from "bcryptjs";

import {
  apiHandler,
  authenticated,
  getJsonBody,
  json,
} from "@/app/api/_utils";

import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";
import {
  revokeAllAdminSessions,
} from "@/services/refreshTokenService";

export async function POST(request) {
  return apiHandler(async () =>
    authenticated(async (user) => {
      const body = await getJsonBody(request);

      const {
        currentPassword,
        newPassword,
      } = body;

      if (!currentPassword || !newPassword) {
        throw new Error(
          "Current and new password are required"
        );
      }

      if (newPassword.length < 8) {
        throw new Error(
          "New password must contain at least 8 characters"
        );
      }

      await connectDB();

      const admin = await Admin.findById(
        user.id || user._id
      ).select("+passwordHash");

      if (!admin) {
        throw new Error("Admin not found");
      }

      const valid =
        await bcrypt.compare(
          currentPassword,
          admin.passwordHash
        );

      if (!valid) {
        throw new Error(
          "Current password is incorrect"
        );
      }

      admin.passwordHash =
        await bcrypt.hash(newPassword, 12);

      admin.passwordChangedAt = new Date();

      await admin.save();

      await revokeAllAdminSessions(
        admin._id
      );

      return json({
        message:
          "Password changed successfully. Please login again.",
      });
    })
  );
}