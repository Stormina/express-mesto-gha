const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

router.use('/cards', UnauthorizedError, cardsRouter);
router.use('/users', UnauthorizedError, usersRouter);
router.use('/', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
