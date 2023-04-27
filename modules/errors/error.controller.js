/* eslint-disable no-return-assign */
const AppError = require('./ApiError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// jwt
const handleJwtError = () =>
  new AppError(`Invalid Token. Please login again`, 401);

const handleJwtExpireError = () =>
  new AppError(`Your Token Expired. Please login again`, 401);

const handleDuplicateFieldsDB = (err) => {
  // const [value] = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value : ${JSON.stringify(
    err.keyValue
  )}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res, error) => {
  // operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) log error
    // console.error('Error!!>>>', err);
    // 2) send message
    res.status(500).json({
      status: 'Error',
      message: 'Something Went very wrong!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (err.name === 'TokenExpiredError') error = handleJwtExpireError(error);
    sendErrorProd(error, res);
  }
};
