const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .catch(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Доступ запрещен');
      }
      Card.findOneAndDelete(req.params.cardId)
        .then((item) => {
          res.send({ data: item });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Переданы не корректные данные');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Переданы не корректные данные');
      }
    })
    .catch(next);
};
