const Joi = require('joi');

const getList = {
  query: Joi.object().keys({
    apiname: Joi.string().required().valid('mangadex', 'kitsu'),
    type: Joi.string().required(),
  }),
};

module.exports = {
  getList,
};
