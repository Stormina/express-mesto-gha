const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validate = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new CelebrateError('Некорректный адрес');
};

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validate),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.idValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardIdValidation = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validate),
  }),
});

module.exports.aboutValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validate),
  }),
});
