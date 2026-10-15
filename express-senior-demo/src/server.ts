import app from './app';

import env from './config/env';
import logger from './config/logger';
import pool from './config/db';

const server = app.listen(env.port, () => {
  logger.info(
    { port: env.port },
    `Server running at http://localhost:${env.port}`
  );
});

async function shutdown(signal: string): Promise<void> {
  logger.info(
    { signal },
    'Shutdown signal received'
  );

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await pool.end();

      logger.info(
        'PostgreSQL connection pool closed'
      );

      process.exit(0);
    } catch (error) {
      logger.error(
        { err: error },
        'Error while closing PostgreSQL pool'
      );

      process.exit(1);
    }
  });
}

process.on(
  'SIGTERM',
  () => void shutdown('SIGTERM')
);

process.on(
  'SIGINT',
  () => void shutdown('SIGINT')
);