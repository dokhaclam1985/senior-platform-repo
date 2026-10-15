import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL;

export async function authenticatedFetch(
  path: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();

  let accessToken =
    cookieStore.get("accessToken")?.value;

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!accessToken) {
    return new Response(
      JSON.stringify({
        message: "Access token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async function callApi(token: string) {
    return fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  }

  let response = await callApi(accessToken);

  if (response.status !== 401) {
    return response;
  }

  if (!refreshToken) {
    return response;
  }

  const refreshResponse = await fetch(
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

  if (!refreshResponse.ok) {
    return response;
  }

 const refreshData = await refreshResponse.json();

    if (
    !refreshData.accessToken ||
    typeof refreshData.accessToken !== "string"
    ) {
    return response;
    }

    return callApi(refreshData.accessToken);
}