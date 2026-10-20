import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '../config/env';

interface AccessTokenPayload extends JwtPayload {
  id: string;
  username: string;
  role?: string;
}

export function jwtAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
    // Fail closed until production authentication is implemented
  if (env.nodeEnv === 'production') {
    res.status(403).json({
      message: 'Demo authentication is disabled in production',
    });
    return;
  }
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      env.jwtSecret
    ) as AccessTokenPayload;

 req.user = {
  id: decoded.id,
  username: decoded.username,
  role: decoded.role,
};

    next();
  } catch {
    res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}