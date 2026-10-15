import { getSession } from "./session";

export async function getAccessToken() {
  const session = await getSession();

  return session.accessToken;
}

export async function getRefreshToken() {
  const session = await getSession();

  return session.refreshToken;
}

export async function getUserRole() {
  const session = await getSession();

  return session.userRole;
}

export async function isAuthenticated() {
  const session = await getSession();

  return session.isAuthenticated;
}