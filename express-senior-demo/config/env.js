require('dotenv').config();

const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

for (const envName of requiredEnvVars) {
  if (!process.env[envName]) {
    throw new Error(
      `Missing required environment variable: ${envName}`
    );
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT) || 8080,

  jwtSecret: process.env.JWT_SECRET,

  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET,

  corsOrigin:
    process.env.CORS_ORIGIN ||
    'http://localhost:5173',
};

module.exports = env;