const httpStatus = require('http-status');
const ApiError = require('../errors/appError');
const User = require('../user/user.model');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { catchAsync } = require('../utils');
const config = require('../../config/config');

exports.protect = catchAsync(async (req, res, next) => {
  // check token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //   token exist
  if (!token) {
    return next(
      new ApiError(
        `You are not Logged in! Please log in to get access`,
        httpStatus.UNAUTHORIZED
      )
    );
  }
  //   verify token
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);
  //   check token id user
  const findUser = await User.findById(decoded.sub);
  if (!findUser) {
    return next(
      new ApiError(
        `The user belonging to this token does no longer exist`,
        httpStatus.UNAUTHORIZED
      )
    );
  }
  // grant access token
  req.user = findUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          'You do not have permission to perform this action',
          httpStatus.FORBIDDEN
        )
      );
    }
    next();
  };
