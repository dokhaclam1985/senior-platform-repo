import { redirect } from "next/navigation";

import {
  getAccessToken,
  getUserRole,
} from "./auth";

export async function requireAuth() {
  const accessToken =
    await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return accessToken;
}

export async function requireAdmin() {
  await requireAuth();

  const role =
    await getUserRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }
}