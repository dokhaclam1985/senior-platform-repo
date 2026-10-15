"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import UserForm from "./UserForm";

type EditUserFormProps = {
  id: string;
  initialName: string;
  initialEmail: string;
};

export default function EditUserForm({
  id,
  initialName,
  initialEmail,
}: EditUserFormProps) {
  const router = useRouter();

  const [message, setMessage] =
    useState("");

  async function handleUpdate(input: {
    name: string;
    email: string;
  }) {
    setMessage("");

    try {
      const response = await fetch(
        `/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setMessage(
            data.message ??
              "Invalid user data"
          );
        } else if (
          response.status === 401
        ) {
          setMessage(
            "Your session has expired. Please login again."
          );
        } else if (
          response.status === 403
        ) {
          setMessage(
            "You do not have permission to update users."
          );
        } else if (
          response.status === 404
        ) {
          setMessage(
            data.message ??
              "User not found"
          );
        } else if (
          response.status === 409
        ) {
          setMessage(
            data.message ??
              "Email already exists"
          );
        } else {
          setMessage(
            data.message ??
              "Update failed"
          );
        }

        return;
      }

      router.push(
        `/dashboard/users/${id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Update user error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    }
  }

  return (
    <UserForm
      initialName={initialName}
      initialEmail={initialEmail}
      submitLabel="Save"
      savingLabel="Saving..."
      onSubmit={handleUpdate}
      message={message}
    />
  );
}