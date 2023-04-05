const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Тони Старк',
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Гений, миллиардер, филантроп',
    required: true
  },
  avatar: {
    type: String,
    default: 'https://images.app.goo.gl/EzSQwUuhvRnZYonh6',
    required: true
  }
});

module.exports = mongoose.model('user', userSchema);