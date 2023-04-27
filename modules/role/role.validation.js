const Joi = require('joi');

const createRole = Joi.object().keys({
  name: Joi.string().required(),
  status: Joi.string().optional(),
  uniqueId: Joi.string().required(),
});

module.exports = { createRole };
