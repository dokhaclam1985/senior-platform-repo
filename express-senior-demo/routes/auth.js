const express = require('express');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const router = express.Router();

const {
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    env.nodeEnv === 'test'
      ? 1000
      : 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      'Too many login attempts, please try again later',
  },
});

router.post('/login', loginLimiter, login);

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);

module.exports = router;