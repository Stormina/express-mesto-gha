const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({data: users}))
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
        return res.status(400).send({message: 'Переданы некорректные данные'})
      } else {
        return res.status(500).send({ message: err.message });
      }
    })
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({data: user})
      } else {
        res.status(404).send({message: 'Пользователь не найден'})
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

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then((user) => {
      if (user) {
        res.status(200).send({data: user})
      } else {
        return res.status(400).send({message: 'Переданы некорректные данные'})
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

module.exports.patchUser = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then((user) => {
      if (user) {
        res.status(200).send({data: user})
      } else {
        return res.status(400).send({message: 'Переданы некорректные данные'})
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || 'CastError') {
       res.status(400).send({ message: 'Переданы некорректные данные' });
     } else if (err.statusCode === 404) {
       res.status(404).send({ message: 'Пользователь не найден' });
     } else {
      res.status(500).send({ message: err.message });
    }
   })
};

module.exports.patchAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true})
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.statusCode === 400) {
       res.status(400).send({ message: 'Переданы некорректные данные' });
     } else if (err.statusCode === 404) {
       res.status(404).send({ message: 'Пользователь не найден' });
     } else {
      res.status(500).send({ message: err.message });
    }
   })
};