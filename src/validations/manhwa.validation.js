const Joi = require('joi');

const getList = {
  query: Joi.object().keys({
    apiname: Joi.string().required().valid('mangadex', 'kitsu'),
    page: Joi.number().min(0),
    limit: Joi.number().min(1).max(100),
    text: Joi.string(),
    categories: Joi.string(),
    type: Joi.string(),
  }),
};

const getOne = {
  query: Joi.object().keys({
    apiname: Joi.string().required().valid('mangadex', 'kitsu'),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  getList,
  getOne,
};
