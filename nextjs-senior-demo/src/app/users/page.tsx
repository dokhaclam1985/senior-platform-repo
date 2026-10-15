import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUsers } from "@/services/usersService";

export default async function UsersPage() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const users = await getUsers();

  return (
    <main>
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} - {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}