import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  username: string;
  role: string;
};

export async function getSession() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  const userRole =
    cookieStore.get("userRole")?.value;

  return {
    accessToken,
    refreshToken,
    userRole,
    isAuthenticated: Boolean(accessToken),
  };
}