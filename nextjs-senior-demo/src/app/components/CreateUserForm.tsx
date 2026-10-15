"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import UserForm from "./UserForm";

export default function CreateUserForm() {
  const router = useRouter();

  const [message, setMessage] =
    useState("");

  async function handleCreate(input: {
    name: string;
    email: string;
  }) {
    setMessage("");

    try {
      const response = await fetch(
        "/api/users",
        {
          method: "POST",
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
            "You do not have permission to create users."
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
              "Create user failed"
          );
        }

        return;
      }

      router.push(
        "/dashboard/users"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Create user error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    }
  }

  return (
    <UserForm
      submitLabel="Create User"
      savingLabel="Creating..."
      onSubmit={handleCreate}
      message={message}
    />
  );
}