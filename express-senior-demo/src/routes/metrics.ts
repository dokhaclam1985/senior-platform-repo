import { Router } from 'express';

import {
  metricsRegistry,
} from '../metrics/metrics';

const router = Router();

router.get('/', async (_req, res) => {
  res.setHeader(
    'Content-Type',
    metricsRegistry.contentType
  );

  res.end(
    await metricsRegistry.metrics()
  );
});

export default router;