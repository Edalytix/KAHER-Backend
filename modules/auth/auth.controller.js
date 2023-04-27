const AppError = require('../errors/appError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const authService = require('./auth.service');
const userService = require('../user/user.service');
const tokenService = require('../token/token.service');

// signup
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

// login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(`Please provide email and password`, httpStatus.BAD_REQUEST)
    );
  }
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
});
