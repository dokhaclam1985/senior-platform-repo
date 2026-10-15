"use client";

type UsersErrorProps = {
  error: Error;
  reset: () => void;
};

export default function UsersError({
  error,
  reset,
}: UsersErrorProps) {
  return (
    <main>
      <h1>Unable to load users</h1>

      <p>{error.message}</p>

      <button onClick={reset}>
        Try again
      </button>
    </main>
  );
}