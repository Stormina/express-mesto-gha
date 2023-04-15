const { celebrate, Joi } = require('celebrate');

module.exports.loginValidation = celebrate({
  params: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userValidation = celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.idValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardValidation = celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
});

module.exports.aboutValidation = celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.avatarValidation = celebrate({
  params: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/),
  }),
});
