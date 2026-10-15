import { Request, Response } from 'express';

import {
  login,
  refreshAccessToken,
  logout,
} from '../services/authService';

import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../errors/AppError';

interface LoginBody {
  username: string;
  password: string;
}

interface RefreshBody {
  refreshToken: string;
}

export const loginUser = asyncHandler(
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response
  ): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError(
        'Username and password are required',
        400
      );
    }

    const result = await login(username, password);

    if (!result) {
      throw new AppError(
        'Invalid username or password',
        401
      );
    }

    res.status(200).json(result);
  }
);

export const refreshToken = asyncHandler(
  async (
    req: Request<{}, {}, RefreshBody>,
    res: Response
  ): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        'Refresh token is required',
        400
      );
    }

    const accessToken =
      refreshAccessToken(refreshToken);

    if (!accessToken) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    res.status(200).json({
      accessToken,
    });
  }
);

export const logoutUser = asyncHandler(
  async (
    req: Request<{}, {}, RefreshBody>,
    res: Response
  ): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        'Refresh token is required',
        400
      );
    }

    logout(refreshToken);

    res.status(200).json({
      message: 'Logged out successfully',
    });
  }
);