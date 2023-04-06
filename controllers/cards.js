const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
  .populate('owner')
    .then((cards) => {
      if (cards) {
        res.status(200).send(cards);
      } else {
        res.status(400).send({message: 'Переданы некорректные данные'});
      }
    })
    .catch((err) => res.status(500).send({message: err.message}))
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(400).send({message: 'Переданы некорректные данные'});
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        return res.status(400).send({message: 'Переданы некорректные данные'})
      } else {
        return res.status(500).send({ message: err.message });
      }
    })
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete(req.params.cardId)
    .then((card) => /* {
      if (card) { */
        res.status(200).send({data: card})
      /* } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }} */)
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        res.status(400).send({ message: 'Невалидный идентификатор карточки' });
      } else {
        res.status(500).send({ message: err.message });
      }
    })
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, {new: true})
    .then((likes) => res.status(200).send({data: likes}))
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
       res.status(400).send({ message: 'Переданы некорректные данные' });
     } else if (err.statusCode === 404) {
       res.status(404).send({ message: 'Карточка не найдена' });
     } else {
      res.status(500).send({ message: err.message });
    }
   })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true})
    .then((likes) => res.status(200).send({data: likes}))
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
       res.status(400).send({ message: 'Переданы некорректные данные' });
     /* } else if (err.statusCode === 404) {
       res.status(404).send({ message: 'Карточка не найдена' }); */
     } else {
      res.status(500).send({ message: err.message });
    }
   })
};