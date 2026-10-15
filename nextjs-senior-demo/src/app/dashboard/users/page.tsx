import Link from "next/link";

import { requireAdmin } from "@/lib/guards";
import { getUsers } from "@/services/usersService";

export default async function DashboardUsersPage() {
  await requireAdmin();

  const users = await getUsers();

  return (
    <main>
      <h1>User Management</h1>

      <p>
        <Link href="/dashboard/users/new">
          Create User
        </Link>
      </p>

      {users.length === 0 && (
        <p>No users found.</p>
      )}

      {users.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "24px",
          }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Email</th>
              <th style={headerCellStyle}>Role</th>
              <th style={headerCellStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={cellStyle}>
                  {user.id}
                </td>

                <td style={cellStyle}>
                  {user.name ?? "-"}
                </td>

                <td style={cellStyle}>
                  {user.email}
                </td>

                <td style={cellStyle}>
                  {user.role ?? "-"}
                </td>

                <td style={cellStyle}>
                  <Link
                    href={`/dashboard/users/${user.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const headerCellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left" as const,
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};