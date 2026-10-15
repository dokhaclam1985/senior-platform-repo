import { Request, Response } from 'express';

import pool from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const liveness = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    res.status(200).json({
      status: 'ok',
      service: 'express-senior-demo',
    });
  }
);

export const readiness = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ready',
      database: 'connected',
    });
  }
);