import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "80vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #ccc",
          padding: "24px",
        }}
      >
        <h2>Platform</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Link href="/dashboard">
            Dashboard
          </Link>

          <Link href="/dashboard/users">
            Users
          </Link>

          <Link href="/dashboard/settings">
            Settings
          </Link>
        </nav>
      </aside>

      <section
        style={{
          padding: "24px",
        }}
      >
        {children}
      </section>
    </div>
  );
}