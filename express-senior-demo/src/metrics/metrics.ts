import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

export const metricsRegistry =
  new Registry();

collectDefaultMetrics({
  register: metricsRegistry,
  prefix: 'senior_api_',
});

export const httpRequestsTotal =
  new Counter({
    name: 'senior_api_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: [
      'method',
      'route',
      'status_code',
    ],
    registers: [metricsRegistry],
  });

export const httpRequestDurationSeconds =
  new Histogram({
    name: 'senior_api_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: [
      'method',
      'route',
      'status_code',
    ],
    buckets: [
      0.005,
      0.01,
      0.025,
      0.05,
      0.1,
      0.25,
      0.5,
      1,
      2.5,
      5,
    ],
    registers: [metricsRegistry],
  });