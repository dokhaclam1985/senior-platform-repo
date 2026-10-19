
import { Router } from 'express';

import {
  loginUser,
  refreshToken,
  logoutUser,
} from '../controllers/authController';

import { loginRateLimiter } from '../middleware/loginRateLimiter';

const router = Router();

router.post(
  '/login',
  loginRateLimiter,
  loginUser
);

router.post('/refresh', refreshToken);

router.post('/logout', logoutUser);

export default router;
