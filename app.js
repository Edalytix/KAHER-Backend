const compression = require('compression');
const cors = require('cors');
const express = require('express');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const httpStatus = require('http-status');
// const passport = require('passport');
const xss = require('xss-clean');
const config = require('./config/config');
// const { jwtStrategy } = require('./modules/auth');
const { ApiError, errorConverter, errorHandler } = require('./modules/errors');
const { morgan } = require('./modules/logger');
const { authLimiter } = require('./modules/utils');
const routes = require('./routes/v1');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'OK',
  });
});

// v1 api routes
app.use('/api/v1', routes);

// undefined route
app.all('*', (req, res, next) => {
  const err = new ApiError(
    `Can't find ${req.originalUrl} on this server!!`,
    404
  );
  next(err);
});
// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError('Not found', httpStatus.NOT_FOUND));
// });

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
