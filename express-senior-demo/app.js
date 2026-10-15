const env = require('./config/env');
const authRouter = require('./routes/auth');
const requestId = require('./middleware/requestId');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const authenticate = require('./middleware/auth');
const authenticateJWT = require('./middleware/jwtAuth');
const usersRouter = require('./routes/users');
const requireRole = require('./middleware/requireRole');
const errorHandler =
  require('./middleware/errorHandler');
  const pool = require('./config/db');
  const ordersRouter = require('./routes/orders');
const app = express();
const port = env.port;


app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
}));
app.use(requestId);
app.use(requestLogger);

app.use('/api/v1', authRouter);
app.get(
  '/api/v1/admin',
  authenticateJWT,
  requireRole('admin'),
  (req, res) => {
    res.json({
      message: 'Admin area accessed',
      user: req.user,
    });
  }
);

app.get(
  '/api/v1/profile',
  authenticateJWT,
  (req, res) => {
    res.json({
      message: 'Profile accessed',
      user: req.user,
    });
  }
);

app.get('/', (req, res) => {
  res.send('Express Senior Platform Engineer Demo');
});

app.get('/protected', authenticate, (req, res) => {
  res.json({
    message: 'You can access protected data',
  });
});

app.use('/api/v1/users', usersRouter);
app.get('/api/v1/error-demo', (req, res, next) => {
  try {
    throw new Error('Database connection failed');
  } catch (error) {
    next(error);
  }
});
app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'express-senior-demo',
    check: 'liveness',
  });
});

app.get('/health/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      service: 'express-senior-demo',
      check: 'readiness',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'express-senior-demo',
      check: 'readiness',
      database: 'unavailable',
    });
  }
});

app.get('/api/v1/db-check', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1/orders', ordersRouter);
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use(errorHandler);

module.exports = app;