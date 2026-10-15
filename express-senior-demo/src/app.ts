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

app.use(
  cors({
    origin: env.corsOrigin,
  })
);

app.use(express.json());

app.use(requestId);

/*
 * Prometheus endpoint
 */
app.use("/metrics", metricsRouter);

/*
 * Logging + application metrics
 */
app.use(requestLogger);
app.use(metricsMiddleware);

/*
 * Health
 */
app.use("/health", healthRouter);

/*
 * Application APIs
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

/*
 * Grafana alert webhook
 */
app.use("/api/v1/alerts", alertsRouter);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;