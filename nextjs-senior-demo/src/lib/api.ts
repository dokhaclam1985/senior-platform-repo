import "server-only";

import { randomUUID } from "node:crypto";

import { getAccessToken } from "./auth";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const API_BASE_URL =
    process.env.API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is not configured"
    );
  }

  const accessToken =
    await getAccessToken();

  const requestId =
    randomUUID();

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "x-request-id",
    requestId
  );

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  const startedAt =
    Date.now();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
      cache: "no-store",
    }
  );

  const durationMs =
    Date.now() - startedAt;

  console.info(
    JSON.stringify({
      service: "nextjs-senior-demo",
      requestId,
      method:
        options.method ?? "GET",
      path,
      statusCode:
        response.status,
      durationMs,
    })
  );

  return response;
}