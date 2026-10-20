
const request = require('supertest');

// Mock PostgreSQL connection pool
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

describe('Users API', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('GET /api/v1/users should return all users', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      ],
      rowCount: 1,
    });

    const response = await request(app)
      .get('/api/v1/users');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  test('GET /api/v1/users/1 should return one user', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      ],
      rowCount: 1,
    });

    const response = await request(app)
      .get('/api/v1/users/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('GET /api/v1/users/999 should return 404', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    const response = await request(app)
      .get('/api/v1/users/999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });
});
