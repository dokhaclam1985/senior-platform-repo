import { Request, Response } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/usersService';

import { CreateUserDto } from '../types/createUserDto';
import { UpdateUserDto } from '../types/updateUserDto';

import { AppError } from '../errors/AppError';
import { asyncHandler } from '../utils/asyncHandler';

interface UserParams {
  id: string;
}

export const getUsers = asyncHandler(
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const users = await getAllUsers();

    res.status(200).json(users);
  }
);

export const getUser = asyncHandler(
  async (
    req: Request<UserParams>,
    res: Response
  ): Promise<void> => {
    const user = await getUserById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(user);
  }
);

export const createNewUser = asyncHandler(
  async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response
  ): Promise<void> => {
    const { name, email } = req.body;

    const user = await createUser(name, email);

    res.status(201).json(user);
  }
);

export const updateExistingUser = asyncHandler(
  async (
    req: Request<UserParams, {}, UpdateUserDto>,
    res: Response
  ): Promise<void> => {
    const { name, email } = req.body;

    const user = await updateUser(
      req.params.id,
      name,
      email
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(user);
  }
);

export const deleteExistingUser = asyncHandler(
  async (
    req: Request<UserParams>,
    res: Response
  ): Promise<void> => {
    const user = await deleteUser(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      message: 'User deleted',
      user,
    });
  }
);