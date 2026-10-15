import { createUserAction } from "../actions";

export default function NewUserServerActionPage() {
  return (
    <main>
      <h1>Create User - Server Action</h1>

      <form action={createUserAction}>
        <div>
          <label htmlFor="name">
            Name
          </label>

          <br />

          <input
            id="name"
            name="name"
            type="text"
          />
        </div>

        <br />

        <div>
          <label htmlFor="email">
            Email
          </label>

          <br />

          <input
            id="email"
            name="email"
            type="email"
          />
        </div>

        <br />

        <button type="submit">
          Create User
        </button>
      </form>
    </main>
  );
}