import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      data,
      {
        status: response.status,
      }
    );
  }

  const nextResponse = NextResponse.json({
    user: data.user,
  });

  nextResponse.cookies.set(
    "accessToken",
    data.accessToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 15,
    }
  );

  nextResponse.cookies.set(
    "refreshToken",
    data.refreshToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  nextResponse.cookies.set(
  "userRole",
  data.user.role,
  {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  }
);

  return nextResponse;
}