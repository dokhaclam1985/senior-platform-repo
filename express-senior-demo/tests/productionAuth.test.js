
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Test-only environment values
process.env.JWT_SECRET = 'test-only-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-only-refresh-secret';
process.env.DB_PASSWORD = 'test-only-db-password';

function loadAuth(mode) {
  process.env.NODE_ENV = mode;

  // Reload modules so env.ts reads the selected mode
  jest.resetModules();

  return require('../dist/middleware/jwtAuth').jwtAuth;
}

function createTestApp(authMiddleware) {
  const app = express();

  app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({
      role: req.user?.role,
    });
  });

  return app;
}

function makeToken() {
  return jwt.sign(
    { id: '1', username: 'lam', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1m' }
  );
}

describe('Production Authentication Security', () => {

  test('Production blocks a valid JWT', async () => {
    const auth = loadAuth('production');
    const app = createTestApp(auth);

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'Demo authentication is disabled in production'
    );
  });

  test('Development accepts a valid JWT', async () => {
    const auth = loadAuth('development');
    const app = createTestApp(auth);

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${makeToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.role).toBe('admin');
  });

  test('Development rejects a missing JWT', async () => {
    const auth = loadAuth('development');
    const app = createTestApp(auth);

    const response = await request(app)
      .get('/protected');

    expect(response.status).toBe(401);
  });

  test('Production disables demo login', async () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();

    const bcrypt = require('bcrypt');
    const compare = jest.spyOn(bcrypt, 'compare')
      .mockResolvedValue(true);

    try {
      const { login } =
        require('../dist/services/authService');

      const result = await login('lam', 'test-password');

      expect(result).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    } finally {
      compare.mockRestore();
    }
  });

});
