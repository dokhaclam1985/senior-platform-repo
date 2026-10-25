
jest.mock('../dist/config/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const logger = require('../dist/config/logger').default;

const {
  errorHandler,
} = require('../dist/middleware/errorHandler');

const {
  AppError,
} = require('../dist/errors/AppError');

describe('Production Error Logging', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      method: 'POST',
      originalUrl: '/api/v1/auth/login',
    };

    res = {
      headersSent: false,
      locals: {
        requestId: 'test-request-123',
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test('HTTP 401 should log INFO', () => {
    const error = new AppError(
      'Invalid username or password',
      401
    );

    errorHandler(error, req, res, next);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('HTTP 403 should log INFO', () => {
    const error = new AppError('Forbidden', 403);

    errorHandler(error, req, res, next);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('HTTP 409 should log WARN', () => {
    const error = new AppError(
      'Email already exists',
      409
    );

    errorHandler(error, req, res, next);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('HTTP 429 should log WARN', () => {
    const error = new AppError(
      'Too many requests',
      429
    );

    errorHandler(error, req, res, next);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  test('Unexpected error should log ERROR', () => {
    const error = new Error('Unexpected failure');

    errorHandler(error, req, res, next);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
  });

  test('PostgreSQL duplicate key should log WARN', () => {
    const error = new Error('Duplicate key');
    error.code = '23505';

    errorHandler(error, req, res, next);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
