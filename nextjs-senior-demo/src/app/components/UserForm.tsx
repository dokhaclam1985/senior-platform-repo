"use client";

import { FormEvent, useState } from "react";

type UserFormProps = {
  initialName?: string;
  initialEmail?: string;

  submitLabel: string;
  savingLabel: string;

  onSubmit: (input: {
    name: string;
    email: string;
  }) => Promise<void>;

  message?: string;
};

export default function UserForm({
  initialName = "",
  initialEmail = "",
  submitLabel,
  savingLabel,
  onSubmit,
  message = "",
}: UserFormProps) {
  const [name, setName] =
    useState(initialName);

  const [email, setEmail] =
    useState(initialEmail);

  const [saving, setSaving] =
    useState(false);

  const [validationMessage, setValidationMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setValidationMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setValidationMessage(
        "Name is required"
      );
      return;
    }

    if (!cleanEmail) {
      setValidationMessage(
        "Email is required"
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      setValidationMessage(
        "Email is invalid"
      );
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        name: cleanName,
        email: cleanEmail,
      });
    } finally {
      setSaving(false);
    }
  }

  const displayMessage =
    validationMessage || message;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          Name
        </label>

        <br />

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          disabled={saving}
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
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          disabled={saving}
        />
      </div>

      <br />

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? savingLabel
          : submitLabel}
      </button>

      {displayMessage && (
        <p>{displayMessage}</p>
      )}
    </form>
  );
}