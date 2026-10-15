const logger = require('../config/logger');

function requestLogger(req, res, next) {
  const start = Date.now();

  logger.info({
    type: 'request',
    requestId: req.requestId,
    method: req.method,
    url: req.url,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      type: 'response',
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });

  next();
}

module.exports = requestLogger;