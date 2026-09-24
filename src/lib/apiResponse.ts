import { NextResponse } from "next/server";

export interface ApiResponseOptions {
  status?: number;
  headers?: HeadersInit;
}

export function apiSuccess<T>(data: T, options: ApiResponseOptions = {}) {
  const { status = 200, headers } = options;
  return NextResponse.json(
    {
      success: true,
      ...(typeof data === "object" && data !== null && !Array.isArray(data)
        ? data
        : { data }),
    },
    { status, headers }
  );
}

export function apiError(
  message = "An error occurred",
  status = 500,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}
