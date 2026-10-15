const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

const validateUser = require('../middleware/validateUser');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', validateUser, createUser);

router.put('/:id', validateUser, updateUser);

router.delete('/:id', deleteUser);

module.exports = router;