
/**
 * Jest Test Environment
 *
 * Use test-only values.
 * Never use production credentials here.
 */

process.env.JWT_SECRET =
  'test-only-access-secret';

process.env.JWT_REFRESH_SECRET =
  'test-only-refresh-secret';

process.env.DB_PASSWORD =
  'test-only-db-password';

process.env.DB_HOST = '127.0.0.1';

process.env.DB_PORT = '5432';

process.env.DB_NAME = 'senior_test';

process.env.DB_USER = 'senior_test_user';
