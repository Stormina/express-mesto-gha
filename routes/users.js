const usersRouter = require('express').Router();
const { aboutValidation, avatarValidation, idValidation } = require('../middlewares/validate');

const {
  getAllUsers,
  getCurrentUser,
  getUserId,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', idValidation, getCurrentUser);
usersRouter.get('/:userId', idValidation, getUserId);
usersRouter.patch('/me', aboutValidation, patchUser);
usersRouter.patch('/me/avatar', avatarValidation, patchAvatar);

module.exports = usersRouter;
