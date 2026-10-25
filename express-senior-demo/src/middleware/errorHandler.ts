
import { Request, Response, NextFunction } from 'express';

import logger from '../config/logger';
import { AppError } from '../errors/AppError';

interface DatabaseError extends Error {
  code?: string;
}

// ======================================
// Global Error Handler
// ======================================

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {

  // Response already started
  if (res.headersSent) {
    next(err);
    return;
  }

  // Common logging context
  const logContext = {
    method: req.method,
    url: req.originalUrl,
    requestId: res.locals.requestId,
  };

  // ====================================
  // 1. Expected Application Errors
  // ====================================

  if (err instanceof AppError) {

    const statusCode = err.statusCode;

    if (statusCode >= 500) {
      logger.error(
        { ...logContext, statusCode, err },
        'Application server error'
      );
    } else if (statusCode === 429) {
      logger.warn(
        { ...logContext, statusCode },
        'Request rate limited'
      );
    } else if (statusCode === 409) {
      logger.warn(
        { ...logContext, statusCode },
        'Application conflict'
      );
    } else {
      logger.info(
        { ...logContext, statusCode },
        'Expected application error'
      );
    }

    res.status(statusCode).json({
      message: err.message,
    });

    return;
  }

  // ====================================
  // 2. PostgreSQL Duplicate Key
  // ====================================

  const dbError = err as DatabaseError | null;

  if (dbError?.code === '23505') {

    logger.warn(
      { ...logContext, statusCode: 409, code: '23505' },
      'Database unique constraint violation'
    );

    res.status(409).json({
      message: 'Email already exists',
    });

    return;
  }

  // ====================================
  // 3. Unexpected Server Errors
  // ====================================

  logger.error(
    {
      ...logContext,
      statusCode: 500,
      err,
    },
    'Unhandled application error'
  );

  res.status(500).json({
    message: 'Internal Server Error',
  });
}
