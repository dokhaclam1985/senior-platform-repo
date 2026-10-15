"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteUserButtonProps = {
  id: string;
};

export default function DeleteUserButton({
  id,
}: DeleteUserButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setMessage(
          data.message ?? "Delete failed"
        );

        setDeleting(false);
        return;
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch {
      setMessage("Unable to delete user");
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}