const httpStatus = require('http-status');
const Joi = require('joi');
const ApiError = require('../errors/appError');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    return next(new ApiError(errorMessage, httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
