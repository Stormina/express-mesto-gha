const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы не корректные данные'));
      } else next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы не корректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError('Пользователь с таким email уже существует'));
      } else next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }

      userId = user._id;

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }

      const token = jwt.sign({ _id: userId }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      return res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      next(err);
    });
};
