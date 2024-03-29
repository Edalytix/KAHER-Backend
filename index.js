const dotenv = require('dotenv');
const path = require('path');
const database = require('./lib/database/index').database;

const appConfig = require('./config/app.config.json');
// dotenv configuration
dotenv.config({
  path: path.join(__dirname, '.env'),
});
console.log(
  `******** Application started in ${process.env.NODE_ENV} mode ********`
);

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis');
const csrf = require('csurf');
const helmet = require('helmet');
const frameguard = require('frameguard');
const cors = require('cors');
const bodyParser = require('body-parser');
const middlewares = require('./middlewares');
const mongoose = require('mongoose');

const routes = require('./routes');
// error handler
const errorHandler = require('./error/error-handler').errorHandler;

const app = express();

app.use('/files', express.static('lib/temp-file'));
app.disable('x-powered-by');
app.set('x-powered-by', false);
// app.use((req, res, next) => {
//   if (req.method.toUpperCase() === "OPTIONS") {
//     return res.status(405).send("Method not allowed").end();
//   }
//   next();
// });

const allowedMethods = ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send('Method not allowed');
  }
  next();
});

app.use(cookieParser());

app.use(frameguard({ action: 'deny' }));
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Utilize a more restrictive policy if needed
const originURLS = [
  // appConfig?.originUrl?[process.env.NODE_ENV]?.https,
  // appConfig?.originUrl?[process.env.NODE_ENV]?.http,
  // appConfig?.originUrl?[process.env.NODE_ENV]?.www?.https,
  // appConfig?.originUrl?[process.env.NODE_ENV]?.www?.http,
  'http://localhost:3000',
  'https://kaher.edalytics.com',
  'http://kaher.edalytics.com',
  'https://approvals.kaher.edu.in',
  'http://approvals.kaher.edu.in',
  'https://incentive.kaher.edu.in',
  'http://incentive.kaher.edu.in',
];

//

app.use(cookieParser());
// logger

// allow origins middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (originURLS.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS:' + origin));
      }
    },
    credentials: true,
    methods: 'GET,POST,PATCH,DELETE',
  })
);

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
}

app.use(function (req, res, next) {
  res.locals.ua = req.get('User-Agent');
  next();
});

app.use((req, res, next) => {
  res.locals.origin = req.headers.origin;
  // console.log(req.headers.origin, ':', req.socket.remoteAddress);
  next();
});

// checking application health
app.use('/services/:language/:v/app-health-check', middlewares.checkHealth);

app.use('/services/:language/v1', middlewares.setLanguage, routes);
app.use('/public', express.static(path.join(__dirname, 'UserAchievements')));

// app.get('/services/:language/v1/health', (req, res) => {
//   res.json({ status: 'OK', message: 'API is healthy' });
// });

app.get('/services/:language/v1/health/2', (req, res) => {
  let db_status = null;
  if (mongoose?.connection?.readyState == 0) db_status = 'disconnected';
  if (mongoose?.connection?.readyState == 1) db_status = 'connected';
  if (mongoose?.connection?.readyState == 2) db_status = 'connecting';
  if (mongoose?.connection?.readyState == 3) db_status = 'disconnecting';
  res.json({
    status: 'OK',
    message: 'API is healthy',
    date: '19/12/2023',
    db_status,
  });
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('Server up on ' + process.env.PORT);
});
