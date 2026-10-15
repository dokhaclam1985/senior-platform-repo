const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  test('POST /api/v1/login should return access and refresh tokens', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'lam',
        password: '123456',
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    expect(response.body.user).toHaveProperty(
      'username',
      'lam'
    );
  });

  test('POST /api/v1/login with wrong password should return 401', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'lam',
        password: 'wrong',
      });

    expect(response.statusCode).toBe(401);

    expect(response.body).toEqual({
      message: 'Invalid credentials',
    });
  });

  test('GET /api/v1/profile without token should return 401', async () => {
    const response = await request(app)
      .get('/api/v1/profile');

    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/profile with valid token should return user', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'lam',
        password: '123456',
      });

    const accessToken =
      loginResponse.body.accessToken;

    const response = await request(app)
      .get('/api/v1/profile')
      .set(
        'Authorization',
        `Bearer ${accessToken}`
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.user).toHaveProperty(
      'username',
      'lam'
    );
  });
  test('GET /api/v1/admin with admin token should return 200', async () => {
    const loginResponse = await request(app)
        .post('/api/v1/login')
        .send({
        username: 'lam',
        password: '123456',
        });

    const accessToken = loginResponse.body.accessToken;

    const response = await request(app)
            .get('/api/v1/admin')
            .set(
            'Authorization',
            `Bearer ${accessToken}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            'message',
            'Admin area accessed'
        );
    });
});