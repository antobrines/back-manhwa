const Joi = require('joi');

const getList = {
  query: Joi.object().keys({
    apiname: Joi.string().required().valid('mangadex', 'kitsu'),
    page: Joi.number().min(0),
  }),
};

const getOne = {
  params: Joi.object().keys({
    apiname: Joi.string().required().valid('mangadex', 'kitsu'),
  }),
};

module.exports = {
  getList,
  getOne,
};
