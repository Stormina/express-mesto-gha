const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner', 'likes')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};
