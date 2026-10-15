
import Link from "next/link";
import { notFound } from "next/navigation";

import { getUserById } from "@/services/usersService";
import DeleteUserButton from "@/app/components/DeleteUserButton";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailPage({
  params,
}: UserDetailPageProps) {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <h1>User Detail</h1>

      <p>ID: {user.id}</p>

      <p>Name: {user.name ?? "-"}</p>

      <p>Email: {user.email}</p>

      <p>Role: {user.role ?? "-"}</p>

      <p>
        <Link href={`/dashboard/users/${user.id}/edit`}>
          Edit
        </Link>
      </p>

      <DeleteUserButton id={String(user.id)} />
    </main>
  );
}
