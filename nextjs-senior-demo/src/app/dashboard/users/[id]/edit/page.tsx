import { notFound } from "next/navigation";

import { getUserById } from "@/services/usersService";
import EditUserForm from "@/app/components/EditUserForm";

type EditUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <h1>Edit User</h1>

      <EditUserForm
        id={id}
        initialName={user.name ?? ""}
        initialEmail={user.email}
      />
    </main>
  );
}