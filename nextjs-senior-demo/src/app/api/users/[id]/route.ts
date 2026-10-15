import {
  NextRequest,
  NextResponse,
} from "next/server";

import { apiFetch } from "@/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function createResponse(
  response: Response
) {
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

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  const body = await request.json();

  const response = await apiFetch(
    `/api/v1/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return createResponse(response);
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  const response = await apiFetch(
    `/api/v1/users/${id}`,
    {
      method: "DELETE",
    }
  );

  return createResponse(response);
}