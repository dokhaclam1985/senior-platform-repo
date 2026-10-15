import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import LogoutButton from "./components/LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Senior Platform Demo",
  description:
    "Next.js frontend for Senior Platform Engineer roadmap",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const role =
    cookieStore.get("userRole")?.value;

  return (
    <html lang="en">
      <body>
        <header
          style={{
            padding: "16px",
            borderBottom: "1px solid #ccc",
            marginBottom: "24px",
          }}
        >
          <nav
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/dashboard">
              Dashboard
            </Link>
            <Link href="/users">
              Users
            </Link>

            {role === "admin" && (
              <Link href="/admin">
                Admin
              </Link>
            )}

            <Link href="/login">
              Login
            </Link>

            <LogoutButton />
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}