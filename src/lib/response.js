import { NextResponse } from "next/server";

export function successResponse(
  data = {},
  message = "Success",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...data,
    },
    { status }
  );
}

export function errorResponse(
  message = "Something went wrong",
  status = 500,
  errors = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}

export function unauthorizedResponse(
  message = "Unauthorized"
) {
  return errorResponse(message, 401);
}

export function notFoundResponse(
  message = "Record not found"
) {
  return errorResponse(message, 404);
}

export function validationResponse(
  message = "Validation failed",
  errors = null
) {
  return errorResponse(message, 400, errors);
}