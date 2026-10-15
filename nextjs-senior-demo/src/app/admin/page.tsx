import { requireAdmin } from "@/lib/guards";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main>
      <h1>Admin</h1>
      <p>Admin access granted.</p>
    </main>
  );
}