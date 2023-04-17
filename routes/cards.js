const cardsRouter = require('express').Router();
const { cardValidation, cardIdValidation } = require('../middlewares/validate');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', cardValidation, createCard);
cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
