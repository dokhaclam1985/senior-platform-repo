const env = require('../config/env');
const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error({
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });
    // PostgreSQL: UNIQUE constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      message: 'Email already exists',
    });
  }
  const statusCode = err.statusCode || 500;

  if (env.nodeEnv === 'development') {
    return res.status(statusCode).json({
      message: err.message || 'Internal server error',
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    message:
      statusCode === 500
        ? 'Internal server error'
        : err.message,
  });
}

module.exports = errorHandler;