const usersRouter = require('express').Router();

const {getAllUsers, getUserId, createUser, patchUser, patchAvatar} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserId);
usersRouter.post('/', createUser);
usersRouter.patch('/me', patchUser);
usersRouter.patch('/me/avatar', patchAvatar);

module.exports = usersRouter;