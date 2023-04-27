const Joi = require('joi');
const mongoose = require('mongoose');
const { password } = require('../validate/custom.validation');

const registerBody = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userId: Joi.string().required(),
  roleId: Joi.string().required(),
  // .custom((value, helpers) =>
  //   value !== typeof mongoose.Schema.ObjectId
  //     ? helpers.message({
  //         custom: 'Invalid role id',
  //       })
  //     : value
  // ),
};

const register = {
  body: Joi.object().keys(registerBody),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
  }),
};

const sentOtp = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

module.exports = {
  refreshTokens,
  register,
  login,
  logout,
  sentOtp,
  verifyEmail,
  verifyOtp,
  resetPassword,
  registerBody,
  forgotPassword,
};
