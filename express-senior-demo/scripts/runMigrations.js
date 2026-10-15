const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const alreadyRun = await client.query(
        `
        SELECT 1
        FROM schema_migrations
        WHERE filename = $1
        `,
        [file]
      );

      if (alreadyRun.rowCount > 0) {
        console.log(`Skipping migration: ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running migration: ${file}`);

      await client.query('BEGIN');

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_migrations (filename)
          VALUES ($1)
          `,
          [file]
        );

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('All migrations completed.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();