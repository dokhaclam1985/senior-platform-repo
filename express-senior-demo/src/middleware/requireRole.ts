import { Request, Response, NextFunction } from 'express';

export function requireRole(requiredRole: string) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({
        message: 'Forbidden',
      });
      return;
    }

    next();
  };
}