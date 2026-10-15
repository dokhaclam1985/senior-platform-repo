import { Request, Response, NextFunction } from 'express';

import logger from '../config/logger';
import { AppError } from '../errors/AppError';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = err as DatabaseError;

logger.error(
  {
    err: error,
    code: error.code,
    detail: error.detail,
    method: req.method,
    url: req.originalUrl,
    requestId: res.locals.requestId,
  },
  'Unhandled application error'
);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  if (error.code === '23505') {
    res.status(409).json({
      message: 'Email already exists',
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
}