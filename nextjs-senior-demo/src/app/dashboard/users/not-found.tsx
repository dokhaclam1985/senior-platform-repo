import Link from "next/link";

export default function UserNotFound() {
  return (
    <main>
      <h1>User not found</h1>

      <p>
        The requested user does not exist.
      </p>

      <Link href="/dashboard/users">
        Back to users
      </Link>
    </main>
  );
}