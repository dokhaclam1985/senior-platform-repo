import { Router } from 'express';

import {
  liveness,
  readiness,
} from '../controllers/healthController';

const router = Router();

router.get('/live', liveness);
router.get('/ready', readiness);

export default router;