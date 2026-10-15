import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from '../metrics/metrics';

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startedAt =
    process.hrtime.bigint();

  res.on('finish', () => {
    const endedAt =
      process.hrtime.bigint();

    const durationSeconds =
      Number(endedAt - startedAt) /
      1_000_000_000;

    const route =
      req.route?.path
        ? `${req.baseUrl}${req.route.path}`
        : 'unmatched';

    const labels = {
      method: req.method,
      route,
      status_code:
        String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);

    httpRequestDurationSeconds.observe(
      labels,
      durationSeconds
    );
  });

  next();
}