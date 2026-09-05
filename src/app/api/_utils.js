import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function apiHandler(handler) {
  try {
    return await handler();
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}

export async function authenticated(handler) {
  const user = await requireAuth();

  return handler(user);
}

export function json(data, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function error(message, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function getJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON request body");
  }
}

export function getQuery(request) {
  return Object.fromEntries(
    new URL(request.url).searchParams.entries()
  );
}

export function getClientInfo(request) {
  return {
    userAgent:
      request.headers.get("user-agent") || "",
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "",
  };
}