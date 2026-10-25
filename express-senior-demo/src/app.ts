import express from "express";
import cors from "cors";

import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import healthRouter from "./routes/health";
import metricsRouter from "./routes/metrics";
import alertsRouter from "./routes/alerts";

import env from "./config/env";

import { requestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/logger";
import { metricsMiddleware } from "./middleware/metrics";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// =====================================
// 1. Reverse Proxy Configuration
// =====================================

// Trust one reverse proxy hop in Railway production.
// Local development does not trust forwarded headers.
app.set(
  "trust proxy",
  env.nodeEnv === "production" ? 1 : false
);

// =====================================
// 2. CORS Configuration
// =====================================

app.use(
  cors({
    origin: env.corsOrigin,
  })
);

// =====================================
// 3. JSON Body Parser
// =====================================

app.use(express.json());

// =====================================
// 4. Request ID
// =====================================

app.use(requestId);

// =====================================
// 5. Prometheus Endpoint
// =====================================

app.use("/metrics", metricsRouter);

// =====================================
// 6. Logging + Application Metrics
// =====================================

app.use(requestLogger);
app.use(metricsMiddleware);

// =====================================
// 7. Health Check
// =====================================

app.use("/health", healthRouter);

// =====================================
// 8. Application APIs
// =====================================

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// =====================================
// 9. Grafana Alert Webhook
// =====================================

app.use("/api/v1/alerts", alertsRouter);

// =====================================
// 10. Global Error Handler
// =====================================

app.use(errorHandler);

export default app;