import { apiFetch } from "@/lib/api";

export type User = {
  id: number;
  name?: string;
  email: string;
  role?: string;
};

export type UpdateUserInput = {
  name: string;
  email: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
};

export async function getUsers(): Promise<User[]> {
  const response = await apiFetch(
    "/api/v1/users"
  );

  console.log(
    "GET /users status:",
    response.status
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.log(
      "GET /users error:",
      errorBody
    );

    throw new Error(
      `Failed to fetch users: ${response.status}`
    );
  }

  return response.json();
}

export async function getUserById(
  id: string
): Promise<User | null> {
  const response = await apiFetch(
    `/api/v1/users/${id}`
  );

  console.log(
    `GET /users/${id} status:`,
    response.status
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorBody = await response.text();

    console.log(
      `GET /users/${id} error:`,
      errorBody
    );

    throw new Error(
      `Failed to fetch user: ${response.status}`
    );
  }

  return response.json();
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<User> {
  const response = await apiFetch(
    `/api/v1/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  console.log(
    `PUT /users/${id} status:`,
    response.status
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.log(
      `PUT /users/${id} error:`,
      errorBody
    );

    throw new Error(
      `Failed to update user: ${response.status}`
    );
  }

  return response.json();
}

export async function createUser(
  input: CreateUserInput
): Promise<User> {
  const response = await apiFetch(
    "/api/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  console.log(
    "POST /users status:",
    response.status
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.log(
      "POST /users error:",
      errorBody
    );

    throw new Error(
      `Failed to create user: ${response.status}`
    );
  }

  return response.json();
}