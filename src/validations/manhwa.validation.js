const Joi = require('joi');

const getList = {
  params: Joi.object().keys({
    email: Joi.string().required(),
  }),
};

module.exports = {
  getList
};
