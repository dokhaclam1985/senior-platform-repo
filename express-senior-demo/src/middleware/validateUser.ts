import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from '../types/createUserDto';

export function validateUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction
): void {
  if (!req.body) {
    res.status(400).json({
      message: 'Request body is required',
    });
    return;
  }

  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({
      message: 'Name and email are required',
    });
    return;
  }

  if (typeof name !== 'string' || typeof email !== 'string') {
    res.status(400).json({
      message: 'Name and email must be strings',
    });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({
      message: 'Invalid email format',
    });
    return;
  }

  next();
}