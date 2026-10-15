import pool from '../config/db';
import { User } from '../types/user';

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query<User>(`
    SELECT id, name, email, created_at
    FROM users
    ORDER BY id
  `);

  return result.rows;
}

export async function getUserById(
  id: string
): Promise<User | null> {
  const result = await pool.query<User>(
    `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export async function createUser(
  name: string,
  email: string
): Promise<User> {
  const result = await pool.query<User>(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, created_at
    `,
    [name, email]
  );

  return result.rows[0];
}
export async function updateUser(
  id: string,
  name: string,
  email: string
): Promise<User | null> {
  const result = await pool.query<User>(
    `
      UPDATE users
      SET name = $1,
          email = $2
      WHERE id = $3
      RETURNING id, name, email, created_at
    `,
    [name, email, id]
  );

  return result.rows[0] || null;
}

export async function deleteUser(
  id: string
): Promise<User | null> {
  const result = await pool.query<User>(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, name, email, created_at
    `,
    [id]
  );

  return result.rows[0] || null;
}