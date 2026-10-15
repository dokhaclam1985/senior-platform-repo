"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";

export async function createUserAction(
  formData: FormData
) {
  const name =
    String(formData.get("name") ?? "").trim();

  const email =
    String(formData.get("email") ?? "").trim();

  if (!name) {
    throw new Error("Name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  const response = await apiFetch(
    "/api/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to create user: ${response.status}`
    );
  }

  revalidatePath("/dashboard/users");

  redirect("/dashboard/users");
}

export async function updateUserAction(
  id: string,
  formData: FormData
) {
  const name =
    String(formData.get("name") ?? "").trim();

  const email =
    String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    throw new Error(
      "Name and email are required"
    );
  }

  const response = await apiFetch(
    `/api/v1/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update user: ${response.status}`
    );
  }

  revalidatePath("/dashboard/users");
  revalidatePath(
    `/dashboard/users/${id}`
  );

  redirect(
    `/dashboard/users/${id}`
  );
}

export async function deleteUserAction(
  id: string
) {
  const response = await apiFetch(
    `/api/v1/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete user: ${response.status}`
    );
  }

  revalidatePath("/dashboard/users");

  redirect("/dashboard/users");
}