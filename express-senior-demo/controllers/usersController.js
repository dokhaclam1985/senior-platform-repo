const usersService = require('../services/usersService');

async function getUsers(req, res, next) {
  try {
    const users = await usersService.getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const user = await usersService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}


async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;

    const user = await usersService.createUser(
      name,
      email
    );

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = await usersService.updateUser(
      id,
      name,
      email
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);

    const user =
      await usersService.deleteUser(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'User deleted',
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};