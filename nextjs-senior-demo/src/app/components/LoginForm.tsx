"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("Logging in...");

    try {
       const response = await fetch(
        "/api/auth/login",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username,
            password,
            }),
        }
        );

      const data = await response.json();

      console.log("Login status:", response.status);
      console.log("Login response:", data);

      if (!response.ok) {
        setMessage(data.message ?? "Login failed");
        return;
      }

      setMessage("Login successful");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <br />

        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <br />

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button type="submit">
        Login
      </button>

      <p>{message}</p>
    </form>
  );
}