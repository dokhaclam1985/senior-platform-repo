const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const server = app.listen(env.port, () => {
  logger.info({
    message: `Server running at http://localhost:${env.port}`,
  });
});

function shutdown(signal) {
  logger.info({
    message: `${signal} received. Starting graceful shutdown.`,
  });

  server.close(() => {
    logger.info({
      message: 'HTTP server closed.',
    });

    process.exit(0);
  });
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});