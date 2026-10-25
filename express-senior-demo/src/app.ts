
import express from "express";
import cors from "cors";

// =====================================
// 1. Application Routers
// =====================================

import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import healthRouter from "./routes/health";
import metricsRouter from "./routes/metrics";
import alertsRouter from "./routes/alerts";

// =====================================
// 2. Environment Configuration
// =====================================

import env from "./config/env";

// =====================================
// 3. Middleware
// =====================================

import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/logger";
import { metricsMiddleware } from "./middleware/metrics";
import { errorHandler } from "./middleware/errorHandler";

// =====================================
// 4. Express Application
// =====================================

const app = express();

// =====================================
// 5. Reverse Proxy Configuration
// =====================================

// Trust one reverse proxy hop in Railway production.
// Local development does not trust forwarded headers.

app.set(
  "trust proxy",
  env.nodeEnv === "production" ? 1 : false
);

// =====================================
// 6. CORS Configuration
// =====================================

app.use(
  cors({
    origin: env.corsOrigin,
  })
);

// =====================================
// 7. JSON Body Parser
// =====================================

app.use(express.json());

// =====================================
// 8. Request ID
// =====================================

// Assign a unique request ID for tracing.

app.use(requestId);

// =====================================
// 9. Prometheus Endpoint
// =====================================

// Expose application metrics for Prometheus.
// The metrics endpoint is excluded from
// application request logging and metrics.

app.use("/metrics", metricsRouter);

// =====================================
// 10. Logging + Application Metrics
// =====================================

// Log HTTP requests with requestId.
// Record request counts and durations.

app.use(requestLogger);
app.use(metricsMiddleware);

// =====================================
// 11. Health Check
// =====================================

// Liveness and readiness endpoints.

app.use("/health", healthRouter);

// =====================================
// 12. Application APIs
// =====================================

// Authentication APIs.

app.use("/api/v1/auth", authRouter);

// User management APIs.

app.use("/api/v1/users", usersRouter);

// =====================================
// 13. Grafana Alert Webhook
// =====================================

// Receive Grafana alert notifications.
// Supports firing and resolved events.

app.use("/api/v1/alerts", alertsRouter);

// =====================================
// 14. Global Error Handler
// =====================================

// Must be registered after application routes.

app.use(errorHandler);

// =====================================
// 15. Export Application
// =====================================

export default app;
