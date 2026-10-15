import { Request, Response, NextFunction } from 'express';

import logger from '../config/logger';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;

    const isHealthCheck =
      req.originalUrl === '/health/live' ||
      req.originalUrl === '/health/ready';

    if (isHealthCheck) {
      return;
    }

    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        requestId: res.locals.requestId,
      },
      'HTTP request completed'
    );
  });

  next();
}