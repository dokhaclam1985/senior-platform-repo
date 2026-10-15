import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        message: "Refresh token not found",
      },
      {
        status: 401,
      }
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const nextResponse =
      NextResponse.json(
        data,
        {
          status: response.status,
        }
      );

    nextResponse.cookies.set(
      "accessToken",
      "",
      {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      }
    );

    nextResponse.cookies.set(
      "refreshToken",
      "",
      {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      }
    );

    nextResponse.cookies.set(
      "userRole",
      "",
      {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      }
    );

    return nextResponse;
  }

  const nextResponse =
    NextResponse.json({
      message: "Access token refreshed",
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

  return nextResponse;
}