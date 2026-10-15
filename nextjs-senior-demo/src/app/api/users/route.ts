import {
  NextRequest,
  NextResponse,
} from "next/server";

import { apiFetch } from "@/lib/api";

export async function POST(
  request: NextRequest
) {
  const body = await request.json();

  const response = await apiFetch(
    "/api/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data: unknown = null;

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    data = await response.json();
  }

  return NextResponse.json(
    data ?? {
      message: "Request completed",
    },
    {
      status: response.status,
    }
  );
}