// const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config/config');
// const ApiError = require('../errors/appError');

const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

const generateToken = (user, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: user?.id,
    role: user?.role,
    iat: moment().unix(),
    // exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret, { expiresIn: expires });
};

// export const verifyToken = async (token, type) => {
//   const payload = jwt.verify(token, config.jwt.secret);
//   if (typeof payload.sub !== 'string') {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
//   }
//   const tokenDoc = await Token.findOne({
//     token,
//     type,
//     user: payload.sub,
//     blacklisted: false,
//   });
//   if (!tokenDoc) {
//     throw new Error('Token not found');
//   }
//   return tokenDoc;
// };

const generateAuthTokens = async (user) => {
  const accessToken = generateToken(
    user,
    config.jwt.accessExpiration,
    tokenTypes.ACCESS
  );
  return accessToken;
};

// export const generateResetPasswordToken = async (email) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NO_CONTENT, '');
//   }
//   const expires = moment().add(
//     config.jwt.resetPasswordExpirationMinutes,
//     'minutes'
//   );
//   const resetPasswordToken = generateToken(
//     user.id,
//     expires,
//     tokenTypes.RESET_PASSWORD
//   );
//   await saveToken(
//     resetPasswordToken,
//     user.id,
//     expires,
//     tokenTypes.RESET_PASSWORD
//   );
//   return resetPasswordToken;
// };

// export const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(
//     config.jwt.verifyEmailExpirationMinutes,
//     'minutes'
//   );
//   const verifyEmailToken = generateToken(
//     user.id,
//     expires,
//     tokenTypes.VERIFY_EMAIL
//   );
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

module.exports = { generateAuthTokens, generateToken, tokenTypes };
