import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken =
    request.cookies.get("accessToken")?.value;

  const userRole =
    request.cookies.get("userRole")?.value;

  const { pathname } = request.nextUrl;

  const isDashboardRoute =
    pathname.startsWith("/dashboard");

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isLoginRoute =
    pathname === "/login";

  // Chưa đăng nhập mà cố vào route protected
  if (
    !accessToken &&
    (isDashboardRoute || isAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Có login nhưng không phải admin mà vào /admin
  if (
    accessToken &&
    isAdminRoute &&
    userRole !== "admin"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Đã login mà quay lại /login
  if (
    accessToken &&
    isLoginRoute
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};