const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  test('GET /api/v1/users should return all users', async () => {
    const response = await request(app)
      .get('/api/v1/users');

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/v1/users/1 should return one user', async () => {
    const response = await request(app)
      .get('/api/v1/users/1');

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('id', 1);
  });

  test('GET /api/v1/users/999 should return 404', async () => {
    const response = await request(app)
      .get('/api/v1/users/999');

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      message: 'User not found',
    });
  });
});