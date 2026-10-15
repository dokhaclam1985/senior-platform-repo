
import dotenv from "dotenv";

dotenv.config();

// ======================================
// Environment Configuration
// ======================================

interface EnvConfig {
  port: number;
  nodeEnv: string;

  jwtSecret: string;
  jwtRefreshSecret: string;
  corsOrigin: string;

  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
}

// ======================================
// Required Environment Variables
// ======================================

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

// ======================================
// Port Validation
// ======================================

function getPort(name: string, defaultPort: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return defaultPort;
  }

  const port = Number(rawValue);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      `Invalid port configuration: ${name}`
    );
  }

  return port;
}

// ======================================
// Application Environment
// ======================================

const env: EnvConfig = {
  // Application
  port: getPort("PORT", 8080),

  nodeEnv:
    process.env.NODE_ENV || "development",

  // JWT Authentication
  jwtSecret: requiredEnv("JWT_SECRET"),

  jwtRefreshSecret:
    requiredEnv("JWT_REFRESH_SECRET"),

  // CORS
  corsOrigin:
    process.env.CORS_ORIGIN ||
    "http://localhost:3000",

  // PostgreSQL
  dbHost:
    process.env.DB_HOST || "localhost",

  dbPort:
    getPort("DB_PORT", 5432),

  dbName:
    process.env.DB_NAME || "senior_demo",

  dbUser:
    process.env.DB_USER || "senior_user",

  dbPassword:
    requiredEnv("DB_PASSWORD"),
};

export default env;
