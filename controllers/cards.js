const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(STATUS_OK).send({ data: card });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err instanceof 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((likes, cardId) => {
      if (cardId) {
        res.status(STATUS_OK).send({ data: likes });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err instanceof 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((likes, cardId) => {
      if (cardId) {
        res.status(STATUS_OK).send({ data: likes });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err instanceof 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};
