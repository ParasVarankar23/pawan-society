import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      password,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator name is required",
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator email is required",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password is required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters",
        },
        { status: 400 }
      );
    }

    const configuredEmail =
      process.env.ADMIN_EMAIL?.toLowerCase();

    if (
      configuredEmail &&
      email.toLowerCase() !==
        configuredEmail
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is not authorized to create the administrator account",
        },
        { status: 403 }
      );
    }

    const existingAdmin =
      await Admin.findOne({
        email: email.toLowerCase(),
      });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator account already exists",
        },
        { status: 409 }
      );
    }

    const existingAnyAdmin =
      await Admin.exists({});

    if (existingAnyAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator account has already been configured",
        },
        { status: 409 }
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const admin =
      await Admin.create({
        name: name.trim(),
        email: email
          .trim()
          .toLowerCase(),
        passwordHash,
        status: "ACTIVE",
        passwordChangedAt:
          new Date(),
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Administrator account created successfully",
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Admin setup error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Unable to create administrator account",
      },
      { status: 500 }
    );
  }
}